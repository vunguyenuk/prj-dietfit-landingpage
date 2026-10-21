# EN hero capture and Deep Scan — 21 October, 23:15 correction

Deep Scan draws six ingredient contours and four labels over the original Rive white calculation screen. It contains no duplicate meal image or phone hardware.

## Correct photo coordinates

The previous overlay treated the 417 × 894 Analytics UI texture as a 413 × 416 meal photo. The visible food is actually the moving hand/bowl seen through that texture's transparent window at x36/y193, width344/height425. The previous assumptions made the contours too wide and too low.

The overlay now fits that window, clipped to its rounded corners. Traces are drawn against the actual shared 710 × 710 meal crop, then transformed through the unchanged hand/bowl bone and image pose into the calculation window. Desktop world bounds are x743.2506904/y307.1784222/w432.2418090/h534.0196768; compact bounds are x746.8418899/y324.0055769/w425.0804389/h525.1720539. Both use the canvas's centered FitHeight safe viewport. Resize recomputes the screen scale.

An independent check derives those bounds and several meal points from the original Rive transform records. A reference render of the unchanged hand texture plus SVG paths is saved outside the repo as `prj-dietfit-review-2026-10-20/scan-alignment-reference.png`. It verifies contour placement on the native clipped food, not the full website render.

## Clean capture and arm pose

The native early forearm rotation exposes a detached triangular tip. EN now begins at the clean settled hand pose (desktop frame90/539, compact77/1925), preserving the following phone entry. Before progress .24, camera playback reaches desktop149/539 or compact171/1925. At .24 it switches directly to the settled calculation frame199/539 or274/1925. This skips the native camera/calculation crossfade that showed two status bars and two screens simultaneously.

Contours occupy progress .24–.44, with staggered labels, a light scan band and reverse-scroll erasure. After .44 the original calculation/result timeline resumes and hands off to the scroll-driven finale. There is no autoplay timer. Rive assets, animation bytes and VI playback remain unchanged.

## Frame and validation

The latest requested vertical spacing caps at 40 CSS px. Smaller compact gutters remain smaller; the same bounded FitHeight scale prevents phone cropping.

Checks pass for native window/held bone geometry at desktop, 2K, 4K, tablet and phone; clean camera/calculation mapping, freeze/reverse, scan ordering, finale frame continuity, resize, reduced motion, JavaScript syntax and site build. The newest full-page render remains unverified because the session's browser connection is unavailable despite the user's enabled setting.


## Restore arm lowering; local elbow repair — 22 October

The latest feedback supersedes the earlier frame90/frame77 start. EN playback now starts at native frame0 and includes the original lowering rotation (desktop frames43–90), while retaining the existing camera/calculation crossfade skip and scan hold. The scroll-driven foreground fade is removed, so the hand and bowl stay opaque.

Only the proximal top 160px of the existing 1536×1055 hand texture is clipped to a rounded elbow cap. The previous straight texture edge rotated into view as a pointed wedge. The native pivot remains within the retained opaque region. `tools/build-rive-elbow-texture.cjs` produces the repair deterministically; `tools/build-rive-foreground.py` embeds it into the two EN foreground variants. No replacement photograph is used. Original hand/meal dimensions, opaque pixels and alpha below y161, transforms, and every desktop/compact animation/state-machine byte are verified unchanged.

Build order: render US assets → package US Rive images → build local elbow texture → package EN foreground Rive files. The native artwork rotation reference is saved outside the repository as `prj-dietfit-review-2026-10-20/elbow-rotation-reference.png`. It is an art-coordinate check, not a browser screenshot. Browser rendering remains unverified because the session connection is unavailable.
