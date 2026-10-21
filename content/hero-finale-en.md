# EN hero: shared-element meal-plans sequence

Reference: user-supplied `/Users/vunguyen/Desktop/meal-plans.mp4` (6.47 seconds), examined frame by frame, including its nutrient transfer and phone-to-dashboard assembly. Dietfit retains its own meal, typography, product data and artwork.

The EN hero uses a 900svh natural sticky runway. Capture and Deep Scan occupy the first 62%. The next 32% drives the finale, then the final 6% holds the completed dashboard before the sticky stage releases.

The finale is a pure function of scroll progress:

- 0–24.5%: mascot peeks from the left side of the phone, greets with a gentle lean and retreats behind the same edge.
- 27–38%: one calorie-budget panel moves out beside the phone.
- The complete native Meal Detail screen is present from the start of the finale. It does not slide a second result UI over the old scrolled information screenshot.
- 49–68%: colored nutrient dots move from the meal's macros to the budget; its ring, food total and macro values update. The reviewed 620 kcal meal changes food from 990 to 1,610 kcal, leaving 590 kcal against a 2,000 goal plus 200 activity calories.
- 72–88%: the **same budget and same result panel** translate and scale into their dashboard positions. Only the phone hardware fades away; the result and budget remain fully opaque. There is no second copy of either UI underneath them.
- 83–93%: the enclosing dashboard surface expands behind those panels, the title is uncovered and Meal plan opens below the budget.
- 93–100%: completed dashboard stays readable.

This replaces the previous whole-phone/dashboard crossfade, which produced doubled translucent text and images at intermediate scroll positions. The dashboard does not have an opacity animation. Its budget and journal have exactly one DOM instance each throughout the sequence. Layout is measured on setup, image decode, font readiness and resize; per-frame movement uses transforms, small clip reveals and the hardware opacity. Existing Rive exports remain unchanged and pause before the native many-card burst. VI behavior is unchanged.

No timers, autoplay, wheel cancellation or scroll lock drive the finale. A stationary scroll position freezes all movement and counters, and reverse scrolling restores the earlier meal and budget state. Reduced motion retains the static poster. The rounded dark scene is separate from the shared panels, allowing the calorie card to extend beyond its edges.

Validation: deterministic non-zero geometry tests cover shared identities, opaque docking at intermediate frames, nutrient flight, total arithmetic, stationary state, reversal, desktop/compact native handoff, resize and reduced motion. Deep Scan regression, syntax and site build pass. Final browser visual verification for this revision is blocked while this session's browser connection is unavailable despite the enabled setting.

## Figma UI correction — 21 October, evening

The user supplied the Scan Meal Flow + Meal Detail page `25395:22061` in file `o5xi1PVyNzq4HOwH1gFf96`. Its Demo / Meal Detail frame `36627:85534` is the implementation reference, read with high-fidelity design context and its screenshot. The previous invented “Scan result” header, ingredient pills, open macro row and orange button were removed.

The result now uses the frame's 375 × 812 app coordinates, Be Vietnam Pro, 468px photo area, overview at y=315 with 8px side gutters, time badge, quantity controls, bordered 80px calorie box, three bordered macro cells, page dots and black 56px bottom action. The existing scanned dish, image, portions and nutritional values remain the meal data across the capture/result/transfer sequence. Twelve original Figma SVG assets are downloaded locally; their intrinsic dimensions are preserved. Provenance is in `assets/hero/figma-meal-detail/source.json`.

The obsolete scrolled screenshot is removed from the DOM. One opaque native result remains in the phone and docks as the same panel. Its typography, SVG assets and card geometry scale together. Corner radius and nutrient source positions derive from that same scale.

The hero's pinned top/bottom whitespace now equals the measured side gutter of the shared container, accounting for scrollbar width. The stage height is viewport height minus twice that gutter. Scroll progress uses the resulting stage height, so the finale still finishes before release. Insets also update on resize and in reduced-motion mode. Other section margins remain 100px.

New DOM checks cover the Figma node, native SVG slots and nonempty local assets, removal of the old stacked UI, measured insets and VI isolation. Shared-panel transfer/freeze/reverse/resize checks, native scan geometry tests, JS syntax and the site build pass. Rendered browser geometry and screenshot comparison remain unverified because this session's browser connection is unavailable.

## Side-peek correction

The hero mascot now emerges horizontally from the left phone edge at 27% of its height, leaving the top of the viewport clear. The complete original waving image is used once. The separate masked/rotated arm layer and body cutout mask are removed, eliminating their tearing seam. Only the phone-side occlusion boundary clips the image; the other three sides have extra room for the greeting lean. It retreats before the budget panel appears, preserving the existing scroll timings, freeze and reversal. No timed animation is added.
