# EN feature phone sizing and companion placement

Deep Scan and Meal Plan now use the same two equal columns, device fit calculation and visual width as AI Coach and Connected Health. The external mascot occupies an absolute layer behind the phone instead of a second lane that reduces the device's available width. Its width is capped at 220px and tied to the rendered phone width. It peeks from the inward side of the phone, with a small overlap and feet near the phone's baseline. Existing wave and focused notebook animations and artwork are retained.

The EN fit function uses the full stage width for every phone. The original 395 × 832 app coordinate system and height limit remain intact. No app content, scroll renderer or interactive controls were rescaled independently. The shared function retains the original width calculation on VI.

Widgets also regain their full visual column, with a smaller 180px companion cap. The existing tablet/mobile rule that hides external decorative companions is preserved.

Live browser measurements after the change:

| Viewport | Deep Scan | AI Coach | Meal Plan | Connected Health |
| --- | --- | --- | --- | --- |
| 2560 × 1262 | 454.25 × 956.80 | 454.25 × 956.80 | 454.25 × 956.80 | 454.25 × 956.80 |
| 1024 × 900 | 355.10 × 747.96 | 355.10 × 747.96 | 355.10 × 747.96 | 355.10 × 747.96 |
| 390 × 844 | 294.35 × 620 | 294.35 × 620 | 294.35 × 620 | 294.35 × 620 |

Before the change, the two mascot sections measured 322px wide while the two sections without mascots measured 454.25px at the desktop viewport. Tablet and mobile checks report no horizontal page overflow. Syntax, site build and the existing EN/VI game-mascot lifecycle checks pass.
