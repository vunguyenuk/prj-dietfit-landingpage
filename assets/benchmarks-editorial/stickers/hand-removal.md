# Meal cutout: hand removal

28 October 2026. User requested removing the hand from the Benchmark collage food cutout.

- Input (unchanged): `assets/benchmarks-page/landing/v3/hero/deep-scan/meal.webp`.
- Output: `assets/benchmarks-editorial/stickers/meal-no-hand.webp`.
- Method: built-in imagegen precise object edit, followed by proportional 710×710 transparent containment and WebP encoding with Sharp.
- Scope: only the Benchmark collage uses the edited sibling asset. The Home source remains unchanged.

## Exact edit prompt

Use case: precise-object-edit. Image 1 is the edit target: the existing transparent cutout of a real ceramic bowl of food used as a small Dietfit webpage decoration. Remove ONLY the human hand and fingers gripping the upper-left edge of the bowl. Reconstruct the small bowl rim and tiny food area that the fingers occlude in a natural photographic way. Preserve the SAME bowl, grain arrangement, egg, yolk, roasted orange sweet potato, greens, lime wedge, sauce cup, sesame seeds, camera angle, lighting, colors and composition as closely to the input pixels as possible. Do not restyle, beautify, rearrange, replace ingredients, or turn the photograph into illustration. Keep the bowl the same size and placement on the same square canvas, fully visible, no new cropping. Preserve genuine alpha transparency around the food bowl. No people, hands, arms, text, labels, new props or background.
