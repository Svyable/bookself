from __future__ import annotations

import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ORIENT_COMMAND = "python3 scripts/publication_state.py --root . --json"
PUBLICATION_COMMAND = "python3 scripts/publication_state.py <slug> --root . --json"


class AgentEntryContractTests(unittest.TestCase):
    def test_human_and_machine_entrypoints_share_the_orientation_contract(self):
        manifest = json.loads((ROOT / "bookself.json").read_text(encoding="utf-8"))
        quickstart = (ROOT / "docs" / "agent-quickstart.md").read_text(encoding="utf-8")
        llms = (ROOT / "llms.txt").read_text(encoding="utf-8")

        orient = manifest["capabilities"]["orientRepository"]
        self.assertEqual(orient["command"], ORIENT_COMMAND)
        self.assertIn(ORIENT_COMMAND, quickstart)
        self.assertIn(ORIENT_COMMAND, llms)
        self.assertIn(PUBLICATION_COMMAND, quickstart)
        self.assertIn(PUBLICATION_COMMAND, llms)
        self.assertIn(
            "inspect → load only the applicable rules/rights/skill → act → validate → inspect again",
            quickstart,
        )
        self.assertIn("The canonical operational path is the [Agent quickstart]", llms)

    def test_skill_index_routes_every_current_canonical_skill(self):
        skill_root = ROOT / ".agents" / "skills"
        index = (skill_root / "README.md").read_text(encoding="utf-8")
        current = sorted(
            child.name
            for child in skill_root.iterdir()
            if child.is_dir() and (child / "SKILL.md").is_file()
        )

        self.assertTrue(current)
        self.assertIn("## Choose the smallest skill that fits", index)
        self.assertIn("Do not load every skill.", index)
        for name in current:
            with self.subTest(skill=name):
                self.assertIn(f"`{name}`", index)


if __name__ == "__main__":
    unittest.main()
