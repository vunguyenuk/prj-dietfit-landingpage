# Dietfit EN hero imagery

## Current revision: user-supplied photo, 21 October 2026

The previous Brooke Lark breakfast variant is replaced by the user's attached café-table photograph, showing a quinoa/roasted vegetable/egg bowl and an omelet plate on a green outdoor table.

- `table-source.png`: exact user-provided PNG, 1199×1799. Desktop background uses proportional cover cropping; the mobile fallback poster uses the portrait source directly.
- `meal-hand-source.png`: top bowl cropped from that photograph, alpha-masked into the existing moving plate slot and composited with the existing hand. This is a photographic composite, not an untouched photograph of someone holding this bowl.
- `bg.webp`, `hands.webp`, `food.webp`, `scan.png`: derived with `tools/build-rive-us.cjs`; the same bowl appears in the scene and app thumbnails.
- Result copy: “Roast veggie bowl”, 620 kcal of illustrative sample portions. These values do not measure the photographer's actual meal.
- Rebuild with `tools/build-rive-us.cjs` then `tools/build-rive-us.py`. Provenance is recorded in `photo-sources.json`.

Original VI exports, timelines, state machines and runtime remain unchanged. EN resources use `20261021-user-photo-1` to avoid cached previous imagery.
