# EN hero: shared-element meal-plans sequence

Reference: user-supplied `/Users/vunguyen/Desktop/meal-plans.mp4` (6.47 seconds), examined frame by frame, including its nutrient transfer and phone-to-dashboard assembly. Dietfit retains its own meal, typography, product data and artwork.

The EN hero uses a 900svh natural sticky runway. Capture and Deep Scan occupy the first 62%. The next 32% drives the finale, then the final 6% holds the completed dashboard before the sticky stage releases.

The finale is a pure function of scroll progress:

- 0–24.5%: mascot peeks from the left side of the phone, greets with a gentle lean and retreats behind the same edge.
- 27–38%: one calorie-budget panel moves out beside the phone.
- The complete native Meal Detail screen is present from the start of the finale. It does not slide a second result UI over the old scrolled information screenshot.
- 49–68%: colored nutrient dots move from the meal's macros to the budget; its ring, food total and macro values update. The reviewed 620 kcal meal changes food from 990 to 1,610 kcal, leaving 590 kcal against a 2,000 goal plus 200 activity calories.
- 72–88%: the **same budget and same result panel** translate and scale into their dashboard positions. Only the phone hardware fades away; the result and budget remain fully opaque. There is no second copy of either UI underneath them.
- 83–93%: the title is uncovered and Meal plan opens below the budget. The previous enclosing beige surface is removed.
- 93–100%: completed dashboard stays readable.

This replaces the previous whole-phone/dashboard crossfade, which produced doubled translucent text and images at intermediate scroll positions. The dashboard does not have an opacity animation. Its budget and journal have exactly one DOM instance each throughout the sequence. Layout is measured on setup, image decode, font readiness and resize; per-frame movement uses transforms, small clip reveals and the hardware opacity. Existing Rive exports remain unchanged and pause before the native many-card burst. VI behavior is unchanged.

No timers, autoplay, wheel cancellation or scroll lock drive the finale. A stationary scroll position freezes all movement and counters, and reverse scrolling restores the earlier meal and budget state. Reduced motion retains the static poster. The rounded blurred-meal background is separate from the shared panels, allowing the calorie card to extend beside the phone without clipping.

Validation: deterministic non-zero geometry tests cover shared identities, opaque docking at intermediate frames, nutrient flight, total arithmetic, stationary state, reversal, desktop/compact native handoff, resize and reduced motion. Deep Scan regression, syntax and site build pass. Final browser visual verification for this revision is blocked while this session's browser connection is unavailable despite the enabled setting.

## Figma UI correction — 21 October, evening

The user supplied the Scan Meal Flow + Meal Detail page `25395:22061` in file `o5xi1PVyNzq4HOwH1gFf96`. Its Demo / Meal Detail frame `36627:85534` is the implementation reference, read with high-fidelity design context and its screenshot. The previous invented “Scan result” header, ingredient pills, open macro row and orange button were removed.

The result now uses the frame's 375 × 812 app coordinates, Be Vietnam Pro, 468px photo area, overview at y=315 with 8px side gutters, time badge, quantity controls, bordered 80px calorie box, three bordered macro cells, page dots and black 56px bottom action. The existing scanned dish, image, portions and nutritional values remain the meal data across the capture/result/transfer sequence. Twelve original Figma SVG assets are downloaded locally; their intrinsic dimensions are preserved. Provenance is in `assets/hero/figma-meal-detail/source.json`.

The obsolete scrolled screenshot is removed from the DOM. One opaque native result remains in the phone and docks as the same panel. Its typography, SVG assets and card geometry scale together. Corner radius and nutrient source positions derive from that same scale.

The hero's pinned top/bottom whitespace now equals the measured side gutter of the shared container, accounting for scrollbar width. The stage height is viewport height minus twice that gutter. Scroll progress uses the resulting stage height, so the finale still finishes before release. Insets also update on resize and in reduced-motion mode. Other section margins remain 100px.

New DOM checks cover the Figma node, native SVG slots and nonempty local assets, removal of the old stacked UI, measured insets and VI isolation. Shared-panel transfer/freeze/reverse/resize checks, native scan geometry tests, JS syntax and the site build pass. Rendered browser geometry and screenshot comparison remain unverified because this session's browser connection is unavailable.

## Side-peek correction

The hero mascot now emerges horizontally from the left phone edge at 27% of its height, leaving the top of the viewport clear. The complete original waving image is used once. The separate masked/rotated arm layer and body cutout mask are removed, eliminating their tearing seam. Only the phone-side occlusion boundary clips the image; the other three sides have extra room for the greeting lean. It retreats before the budget panel appears, preserving the existing scroll timings, freeze and reversal. No timed animation is added.


## Phone fit and food-background correction — 21 October, late evening

The EN native canvas now uses centered FitHeight instead of Cover. Its rendering viewport reserves 24px above/below and constrains a 700px-wide central safe frame on narrow displays. The custom viewport is recalculated after each drawing-surface resize, in device pixels. Deep Scan uses that exact viewport scale, so its contours remain over the existing white phone's food image. The poster also uses contain. The shared outer top/bottom gutters remain equal to the side gutter. Original Rive bytes and VI fitting are unchanged.

The final scene replaces the black dotted background with the same scanned roast-veggie bowl photograph, blurred 24px. Only the inset photographic layer is blurred; the phone, text and cards stay sharp. An enlarged image layer and rounded clipping prevent exposed blur edges. A darkened upper image treatment supports the white dashboard title. The beige enclosing dashboard surface is removed from HTML, CSS and its animation controller; the Figma app's own native UI styling remains.

Dashboard width now derives from the actual stage height using container units, including the native 375:812 journal, title, padding and 24px top/bottom reserves. It no longer assumes the stage occupies the whole viewport. Laptop, 2K and 4K layout equations fit within the pinned stage. Phone hardware has its own bounded height; compact layouts constrain its width by available stage height as well.

Validation: initialization/resize tests cover seven stage-size/DPR fixtures and preserve original VI Cover. Independent Deep Scan geometry and shared-panel freeze/reverse/resize tests pass, alongside the site build and syntax checks. These are code/DOM checks. Rendered browser verification remains unavailable through this session's browser connection, so visual seams, text wrapping and Figma/video pixel parity are not claimed as verified.


## Meal-plan balance — 21 October, 21:22 feedback

The dashboard heading is white with a restrained shadow and a darker upper photographic backdrop. Meal plan now uses three equal-height meal rows below its heading/subtitle, filling the existing panel height. Thumbnail columns grow to 24% of the card content width (up to 80px), with larger meal names and secondary text. Width container units keep the hierarchy proportional to this card rather than the whole screen. Compact sizes retain smaller type and tighter gaps. The outer dashboard size, Figma result and scroll sequence remain unchanged.


## Single-background repair and direct review

The initial bench seam came from two independent image layers: a Cover CSS bench and the native bench transformed inside the FitHeight Rive artboard. EN now selects separate `*-foreground-us-en.riv` files. `tools/build-rive-foreground.py` derives them reproducibly by disabling only the `bg` and `Dark bg` embedded images and setting the static artboard fill alpha to zero. It asserts that all remaining bytes, including the complete animation/state-machine suffix, are identical. Original VI, English and US-English Rive exports remain untouched.

One stage pseudo-element owns the responsive bench photograph. The loading poster covers the same frame without inset padding, removing its second rectangular seam. The original phone retains its height fit; the extra 24px canvas inset was removed because the native phone already has internal margins. This also keeps the hand attached to the scene's top edge. Foreground opacity is a pure function of the first 1.2% of scroll, hiding the stray hand sliver at zero progress.

Chrome was available briefly for actual desktop QA at 2560 × 1318: camera/white calculation phone fit in full, the bench seam was absent, the side mascot peek stayed beside the device, and the completed dashboard used the blurred meal with no beige enclosure. White title color and Meal plan's 407px panel with three equal 93.93px rows were measured; no plan overflow occurred. Proof images are in the external review folder `final-2026-10-21/`. Browser access later became unavailable again; subsequent page-heading/card-size changes have code/build validation but no new screenshot.
