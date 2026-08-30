from __future__ import annotations

import json
import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
MANIFEST = ROOT / "bookself.json"
EXPECTED_TEMPLATES = {
    "book": "books/_TEMPLATE/",
    "paper": "books/_PAPER_TEMPLATE/",
    "magazine": "books/_MAGAZINE_TEMPLATE/",
    "newspaper": "books/_NEWSPAPER_TEMPLATE/",
    "journal": "books/_JOURNAL_TEMPLATE/",
    "newsletter": "books/_NEWSLETTER_TEMPLATE/",
    "anthology": "books/_ANTHOLOGY_TEMPLATE/",
    "report": "books/_REPORT_TEMPLATE/",
    "manual": "books/_MANUAL_TEMPLATE/",
    "comic": "books/_COMIC_TEMPLATE/",
}
EXPECTED_PRESETS = {
    "book",
    "literary",
    "modern-essay",
    "editorial",
    "poetry",
    "night-story",
    "accessible",
    "quiet-study",
}


class AgentContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.data = json.loads(MANIFEST.read_text(encoding="utf-8"))

    def test_entry_points_exist(self) -> None:
        for path in self.data["agentEntryPoints"].values():
            self.assertTrue((ROOT / path).exists(), path)
        self.assertTrue((ROOT / ".agents/skills/bookself-publisher/SKILL.md").is_file())
        self.assertTrue((ROOT / ".agents/skills/human-prose/SKILL.md").is_file())

    def test_setup_entrypoint_is_discoverable(self) -> None:
        agents = (ROOT / "AGENTS.md").read_text(encoding="utf-8").lower()
        self.assertIn("set this up for me", agents)
        self.assertIn("doctor-pair.py", agents)
        self.assertIn("desk", agents)
        self.assertIn("shelf", agents)

    def test_publication_templates_match_repository(self) -> None:
        formats = self.data["capabilities"]["createPublication"]["formats"]
        self.assertEqual(formats, EXPECTED_TEMPLATES)
        for path in formats.values():
            self.assertTrue((ROOT / path).is_dir(), path)

    def test_presentation_presets_match_reader_contract(self) -> None:
        presets = set(self.data["capabilities"]["designPublication"]["presets"])
        self.assertEqual(presets, EXPECTED_PRESETS)
        presentation = (ROOT / "reader/js/presentation.js").read_text(encoding="utf-8")
        for preset in presets:
            escaped = re.escape(preset)
            if re.fullmatch(r"[A-Za-z_$][A-Za-z0-9_$]*", preset):
                pattern = rf"(?:['\"]{escaped}['\"]|\b{escaped})\s*:"
            else:
                pattern = rf"['\"]{escaped}['\"]\s*:"
            self.assertRegex(presentation, pattern)

    def test_canonical_commands_point_to_existing_scripts(self) -> None:
        for capability in (
            "bootstrapWorkspace",
            "bootstrapSingleInstance",
            "validateWorkspacePair",
            "validate",
            "syncSharedUi",
            "release",
        ):
            command = self.data["capabilities"][capability]["command"]
            match = re.search(r"scripts/[A-Za-z0-9._-]+", command)
            self.assertIsNotNone(match, command)
            self.assertTrue((ROOT / match.group(0)).is_file(), command)

    def test_setup_completion_is_explicit(self) -> None:
        completion = self.data["completion"]
        self.assertIn("setupReady", completion)
        setup_text = " ".join(completion["setupReady"]).lower()
        self.assertIn("separate git", setup_text)
        self.assertIn("byte-for-byte", setup_text)
        self.assertIn("published", setup_text)

    def test_publication_intent_boundary_is_explicit(self) -> None:
        boundaries = self.data["intentBoundaries"]
        self.assertTrue(any("public" in item.lower() for item in boundaries["requiresUserIntent"]))
        self.assertTrue(any("desk and shelf" in item.lower() for item in boundaries["mayInferWithoutAsking"]))
        self.assertTrue(boundaries["explicitPublishExamples"])
        self.assertIn("publishedReady", self.data["completion"])


if __name__ == "__main__":
    unittest.main()
