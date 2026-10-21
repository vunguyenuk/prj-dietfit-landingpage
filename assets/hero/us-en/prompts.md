# Dietfit EN hero imagery

## Current revision: real photography, 21 October 2026

The earlier generated chicken/quinoa and table imagery has been replaced. The current table and bowl use actual photographs by Brooke Lark, discovered through a Pinterest pin and traced to their original Unsplash/Wikimedia sources. See `photo-sources.json` for provenance and CC0 records.

- `table-source.png`: proportionally cropped Breakfast at Dawn photograph.
- `meal-hand-source.png`: cropped yogurt/fruit bowl photograph, masked to a transparent plate-shaped slot and composited with the existing hand from the original EN Rive export. This is a photographic composite, not an unedited photograph of someone holding this bowl.
- `bg.webp`, `hands.webp`, `food.webp`, `scan.png`: derived with `tools/build-rive-us.cjs` so the same bowl appears in the scene, result image and camera thumbnail.
- Result copy now reads “Yogurt & fruit bowl”; nutrition is illustrative sample data with six ingredient energies summing to 488 kcal.
- Run `tools/build-rive-us.cjs` with the existing canvas/sharp dependencies, then `tools/build-rive-us.py` to rebuild the EN exports. Inputs are the checked-in source PNGs.

All original VI exports, runtime code, timelines and state machines remain unchanged. EN resource versions are advanced to avoid cached generated-food assets.
