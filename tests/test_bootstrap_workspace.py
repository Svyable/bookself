from __future__ import annotations

import importlib.util
import tempfile
import unittest
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
SCRIPT = REPO / "scripts" / "bootstrap-workspace.py"
SPEC = importlib.util.spec_from_file_location("bookself_bootstrap_workspace", SCRIPT)
assert SPEC and SPEC.loader
bootstrap_module = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(bootstrap_module)


class BootstrapWorkspaceBoundaryTests(unittest.TestCase):
    def test_bootstrap_creates_complementary_ready_pair(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            workspace = Path(temp) / "workspace"
            result = bootstrap_module.bootstrap(
                workspace,
                owner="Example",
                desk_name="desk",
                shelf_name="shelf",
                initialize_repos=True,
            )

            desk = Path(result["desk"]["path"])
            shelf = Path(result["shelf"]["path"])
            self.assertTrue(result["pairValidation"]["setupReady"], result["pairValidation"])
            self.assertTrue((desk / "desk/index.html").is_file())
            self.assertTrue((desk / "reader/index.html").is_file())
            self.assertFalse((shelf / "desk").exists())
            self.assertTrue((shelf / "reader/index.html").is_file())
            self.assertTrue((shelf / "reader/js/app.js").is_file())
            self.assertTrue((shelf / "reader/js/app-core.js").is_file())
            self.assertFalse(any((shelf / "books").iterdir()))


if __name__ == "__main__":
    unittest.main()
