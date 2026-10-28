# About Us photo refinements — 28 October 2026

- `dinner-shelf-original.png`: user-supplied photograph, clipboard `25f5705b-f917-4f58-9f68-0e086670a853`, 1073 × 666. Replaces the photo beside “What’s for dinner tonight?” in both About Us routes. Existing source mark is preserved.
- `office-lunch-crisp*.webp`: derived from the existing Figma photograph `../about-figma/office-lunch.webp`, 736 × 1104. Same people, composition and colors.
- `dinner-shelf-crisp*.webp`: derived only from `dinner-shelf-original.png`.

Processing is deterministic Lanczos3 resampling and a restrained unsharp mask with Sharp. No generated or reconstructed image content is used. Native-size and 2× files are delivered with responsive `srcset`; enlargement cannot recover detail absent from the original.

Regenerate with `node tools/prepare_about_photos.cjs` in an environment with Sharp installed (or available via `NODE_PATH`).
