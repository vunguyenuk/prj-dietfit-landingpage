# About Us photography

Original image fills downloaded from [the production About Us frame](https://www.figma.com/design/o5xi1PVyNzq4HOwH1gFf96/Prj-DietFit---Production-Sync?node-id=40000270-3134) on 2026-10-28, converted to WebP at quality 92 without resizing or cropping.

| Local asset | Figma image node | Page slot |
| --- | --- | --- |
| office-lunch.webp | 40000270:3186 | Hero |
| pasta-together.webp | 40000270:3208 | Eat well, don’t suffer |
| everyday-treat.webp | 40000270:3273 | Central collage portrait |
| chicken-wings.webp | 40000270:3283 | Lower right collage |
| breakfast-plate.webp | 40000270:3293 | Lower left collage |
| burger.webp | 40000270:3303 | Upper right collage |
| shrimp-rice-bowl.webp | 40000270:3313 | Upper left collage |
| burger-drive-through.webp | 40000270:3440 | Previous Dinner CTA, replaced by the user’s kitchen photograph |
| nutrition-scan.webp | 40000270:3252 | Previous nutrition still, superseded by the Home Deep Scan recording |

The eight photo slots are referenced directly by both `about-us/index.html` and `en/about-us/index.html`. These pages are maintained in place; `tools/build.py` updates their SEO metadata but does not generate their image markup. Existing team portraits remain in place.

The user subsequently replaced the nutrition calculation Rive/still with Home's real Deep Scan recording of chicken shish kebab and rice pilaf, at `/landing/v3/demos/en/dietfit-demo-deepscan.mp4` with the matching JPG poster. Its shared template is `content/components/about-deepscan.html`, applied with `python3 tools/update_about_deepscan.py`. Playback pauses offscreen, respects reduced motion, and has a play/pause control.

The hero now uses conventionally sharpened responsive copies in `../about-photos/`; the closing Dinner CTA uses the user-supplied kitchen photograph. See `../about-photos/source.md` for the original sources and non-generative processing recipe.

## About image refresh — 29 October 2026

Refreshed the eight editorial photographs from the same production frame
`40000270:3134`. The original image fills were downloaded from Figma and
converted to WebP at quality 94, without resizing or generated content. New
filenames keep earlier cached images from reappearing after deployment.

| Current local asset | Figma image node | Page slot |
| --- | --- | --- |
| hero-shared-lunch-20261029.webp | 40000270:3186 | Hero |
| eat-well-together-20261029.webp | 40000270:3208 | Eat well, don’t suffer |
| daily-meal-portrait-20261029.webp | 40000270:3273 | Central collage portrait |
| collage-meal-bowl-20261029.webp | 40000270:3283 | Lower right collage |
| collage-breakfast-20261029.webp | 40000270:3293 | Lower left collage, preserving Figma's zoom and crop |
| collage-burger-20261029.webp | 40000270:3303 | Upper right collage |
| collage-rice-bowl-20261029.webp | 40000270:3313 | Upper left collage |
| dinner-grocery-shopping-20261029.webp | 40000270:3440 | Dinner CTA |

Both About routes now use these image fills and updated image descriptions.
The entire Nutrition section, including its existing Deep Scan UI and recording,
is preserved unchanged as requested. The existing team roster and portraits are
also retained; this refresh changes editorial photography only.
