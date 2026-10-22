# Card headroom edit — 22 October 2026

Final assets: [Apple Health](card-5-headroom.webp), [Smart progress charts](card-6-headroom.webp).

Mode: built-in `image_gen` background outpainting, followed by deterministic compositing of the original photograph over the generated background. The final face is taken from the original artwork, not from the generated output. `tools/build-card-headroom.cjs` verifies that every RGB pixel in the protected face area equals the proportionally resized original. The runner, hand and phone retain the original pixels below the pavement seam. Output encoding is lossless WebP.

The health card's original artwork is scaled uniformly to 65%, positioned at x=262/y=735 on a 1500×2100 canvas, with only non-face edges feathered. The progress card moves down 600px, with the top pavement seam feathered over 60px. Both originals remain unchanged in this directory. Coordinates, source paths and checks are recorded in `headroom-edit.json`.

## Final Apple Health background prompt

Use case: precise-object-edit. Asset type: full-bleed landing page photo card background. Fill ONLY the transparent margins of this 1500×2100 canvas: a top band 735 pixels high and side bands beside the fixed photograph. The existing photograph is positioned x=262,y=735,width=975,height=1365 and is LOCKED. Do not shift or rescale it. Seamlessly extend its warm sunlit outdoor trees, soft green/gold bokeh and natural photographic surroundings into the empty margins so there is no rectangular border or visible seam. Where necessary at its edges, continue existing curls and clothing naturally, without creating another person. The upper 28 percent must remain quiet foliage and bokeh for a white heading; no people, faces, body parts, graphics or text there. CRITICAL: keep the existing woman's face, features, expression, identity, head position, hands, headphones, wristwatch, purple clothing, and both white UI tiles exactly unchanged at their current coordinates. No beautification, no skin smoothing, no new UI, no additional objects. Retain the exact 5:7 canvas and photographic color/lighting.

## Final Progress background prompt

Use case: precise-object-edit. Asset type: background outpainting for a landing-page photo card. The transparent region is ONLY the top 600 pixels of this 1500 by 2100 canvas. Fill this empty top band with a seamless continuation of the softly focused warm gray outdoor pavement from the existing photo directly below, with consistent sunlight and gentle natural texture. Keep the new upper band free of objects for a white heading. Do not add or extend people, heads, faces, body parts, shoes, phones, graphics, numbers or text into this band. The lower existing photograph is locked and must remain in its exact existing coordinates, scale, crop, color and identity. Do not move or regenerate the person, their hands or the phone screen. Preserve the exact rectangular canvas and its 5:7 aspect ratio. Output opaque.

## Verification

The compositing script's exact RGB comparisons pass for the entire protected face and the original runner/phone region. Browser verification on desktop and 390×844 mobile confirms clear separation between copy and faces/phone, complete image loading and no horizontal overflow. Card dimensions, text, typography, carousel motion, all other cards and VI remain unchanged.
