from __future__ import annotations

import re
import unittest
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

REPO = Path(__file__).resolve().parents[1]
READER = REPO / "reader"


class IndexAssetParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.assets: set[str] = set()

    @staticmethod
    def _local(value: str | None) -> str | None:
        if not value:
            return None
        parsed = urlsplit(value)
        if parsed.scheme or parsed.netloc or value.startswith("//"):
            return None
        path = parsed.path.lstrip("./")
        return f"./{path}" if path else None

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        if tag == "script":
            asset = self._local(values.get("src"))
            if asset:
                self.assets.add(asset)
            return
        if tag != "link":
            return
        rel = {part.lower() for part in (values.get("rel") or "").split()}
        if not rel.intersection({"stylesheet", "manifest"}):
            return
        asset = self._local(values.get("href"))
        if asset:
            self.assets.add(asset)


def service_worker_shell(source: str) -> set[str]:
    match = re.search(r"const SHELL = \[(.*?)\n\];", source, flags=re.DOTALL)
    if not match:
        raise AssertionError("reader/sw.js does not expose a SHELL array")
    return set(re.findall(r"['\"](\./[^'\"]+)['\"]", match.group(1)))


STATIC_IMPORT_RE = re.compile(
    r"""(?:import|export)\s+(?:[^'"\n]*?\s+from\s+)?['"](?P<path>\.[^'"]+\.js)['"]"""
)


def static_imports(entry: str) -> set[str]:
    relative = entry.removeprefix("./")
    source_path = READER / relative
    if not source_path.is_file() or source_path.suffix != ".js":
        return set()
    source = source_path.read_text(encoding="utf-8")
    imports: set[str] = set()
    for match in STATIC_IMPORT_RE.finditer(source):
        target = (source_path.parent / match.group("path")).resolve()
        try:
            reader_relative = target.relative_to(READER.resolve())
        except ValueError:
            continue
        imports.add(f"./{reader_relative.as_posix()}")
    return imports


class ReaderShellContractTests(unittest.TestCase):
    def test_every_local_index_asset_is_in_the_deployable_shell(self) -> None:
        parser = IndexAssetParser()
        parser.feed((READER / "index.html").read_text(encoding="utf-8"))
        shell = service_worker_shell((READER / "sw.js").read_text(encoding="utf-8"))

        missing = sorted(parser.assets - shell)
        self.assertEqual(missing, [], f"Reader index assets missing from service-worker SHELL: {missing}")


    def test_shell_is_closed_over_static_javascript_imports(self) -> None:
        shell = service_worker_shell((READER / "sw.js").read_text(encoding="utf-8"))
        missing: list[str] = []
        for entry in sorted(shell):
            for dependency in sorted(static_imports(entry)):
                if dependency not in shell:
                    missing.append(f"{entry} -> {dependency}")
        self.assertEqual(
            missing,
            [],
            "Reader service-worker SHELL is missing static JavaScript dependencies: "
            + ", ".join(missing),
        )

    def test_every_shell_file_exists(self) -> None:
        shell = service_worker_shell((READER / "sw.js").read_text(encoding="utf-8"))
        missing = []
        for entry in sorted(shell):
            relative = entry.removeprefix("./")
            target = READER if not relative else READER / relative
            if not target.exists():
                missing.append(entry)
        self.assertEqual(missing, [], f"service-worker SHELL references missing files: {missing}")


if __name__ == "__main__":
    unittest.main()
