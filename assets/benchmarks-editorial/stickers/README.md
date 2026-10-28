# Benchmark demo story collage

Latest revision: 28 October 2026. After the user rejected the heavy vinyl stickers, they asked for a richer, more creative composition. The current scene adds a food-to-nutrition story while preserving the original phone/video geometry and rounded stage.

Canonical template: `content/components/benchmark-scan-showcase.html`.
Styles: `styles/dietfit-benchmark-showcase.css`.

- Original Home food cutout: `assets/benchmarks-page/landing/v3/hero/deep-scan/meal.webp`, unchanged. Scan brackets and Egg / Greens / Grains labels identify ingredients visible in that bowl.
- Existing Dietfit 3D eating mascot: `assets/brand/mascots/3d/eating.webp`, unchanged. Source provenance is recorded in its adjacent `source.json`.
- Peach camera stamp, fine outlined captions and warm-brown linework.
- A layered paper nutrition slip with Protein / Carbs / Fat chips. This is decorative feature storytelling: no invented quantities, scores or benchmark results.
- A short mascot speech bubble and a few orange accents connect the scene.

No new bitmap or third-party artwork is used. Decorative layers are hidden from assistive technology, ignore pointer events and have no motion. Mobile repositions and scales the layers around the phone; the original video remains unobscured and keeps its accessible play/pause control.

Visual QA: 1440, 768, 390 and 320px; all images loaded, no document overflow or browser errors, video autoplay and manual pause passed.

Latest asset correction: the user requested removing the hand. The collage now uses `meal-no-hand.webp`; see `hand-removal.md` for the exact built-in edit prompt and source provenance. Original Home assets are preserved.
