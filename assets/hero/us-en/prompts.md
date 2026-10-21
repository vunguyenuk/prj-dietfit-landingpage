# Dietfit EN hero imagery

## Current revision: upper background bowl removed, 21 October 2026

The previous Brooke Lark breakfast variant is replaced by the user's attached café-table photograph, showing a quinoa/roasted vegetable/egg bowl and an omelet plate on a green outdoor table.

- `table-source.png`: exact user-provided PNG, 1199×1799, retained for source/provenance and camera thumbnails.
- `table-bench-clean.png`: upper background bowl and its shadow removed with built-in imagegen; only the edit region is merged over the original. The lower omelet plate and drink retain their original pixels. Desktop background uses proportional cover cropping; the mobile fallback poster uses this portrait edit directly.
- `meal-hand-source.png`: top bowl cropped from that photograph, alpha-masked into the existing moving plate slot and composited with the existing hand. This is a photographic composite, not an untouched photograph of someone holding this bowl.
- `bg.webp`, `hands.webp`, `food.webp`, `scan.png`: derived with `tools/build-rive-us.cjs`; the same bowl appears in the scene and app thumbnails.
- Result copy: “Roast veggie bowl”, 620 kcal of illustrative sample portions. These values do not measure the photographer's actual meal.
- Rebuild with `tools/build-rive-us.cjs` then `tools/build-rive-us.py`. Provenance is recorded in `photo-sources.json`.

Original VI exports, timelines, state machines and runtime remain unchanged. EN resources use `20261021-bench-clean-1` to avoid cached previous imagery.

Built-in imagegen edit prompt: remove only the upper gray quinoa/egg bowl and its cast shadow; reconstruct the green metal bench slats and gaps in the existing sunlight/perspective; keep the lower omelet, drink, cutlery, napkin and all other photographed content unchanged. The full tool prompt is recorded in `bench-clean-edit.json`.
