# Bookself local tools

Bookself's canonical local tools are Python so the same commands work on macOS, Windows, and Linux.

```text
python scripts/doctor.py
python scripts/sync-ui.py
python scripts/release-book.py <slug> [path-to-shelf]
python scripts/promote-book.py <slug> [path-to-shelf]
python scripts/stamp-instance.py <destination> <binder|shelf> <owner> <repository>
```

On Windows, `py` may be used instead of `python` when that is how Python is installed.

The `.sh` files are convenience wrappers for Unix-like shells. They are not required by Bookself's portability contract.

No `pip install` step is required.
