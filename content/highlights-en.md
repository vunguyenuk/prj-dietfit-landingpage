# EN feature carousel sizing

The carousel stays between integrations and FAQ. Six approved artwork cards are followed by four daily-habit cards from the supplied Notion copy: streaks, challenges/Fitpoints, reminders and shared meals. Original artwork remains unchanged.

The latest request increases card width slightly: desktop uses `(100% - 60px) / 3`; at 1800px and wider, `(100% - 60px) / 3.6`. This supersedes the earlier four-full-card target. Cards preserve the 5:7 ratio and cap their height at viewport height minus 160px. Tablet uses two-card width (height cap svh minus 200px); mobile uses one-card width in the shared frame. Scroll pinning and arrow navigation remain.

Page titles follow the shared EN heading scale. Card headings are 1.25–1.5rem desktop and 1.25rem mobile; desktop body is 1rem, with 1.25–1.5rem padding.

The four live habit cards use two grid rows: natural-height copy followed by a `minmax(0,1fr)` preview area. Each preview fits both the available width and height; its inner query container scales vignette typography with the fitted width. This removes the former fixed 37% art offset, which could overlap longer copy. App/meal images retain square proportions.

Source/DOM and build checks pass. Final visual verification of the newest type/card layout remains pending because this session's browser connection is unavailable despite the user's enabled setting.

## Native habit-card visuals — 22 October

The last four cards replace the generic beige vignettes:

- Streak: exact 343 × 343 component `36892:90074`, including original flame/check assets, type, spacing, week/date cells and colors, scaled uniformly over a separate human-expression photo.
- Challenges + Fitpoints: exact square `36892:90110`, with its target illustration, four original icons and progress; the original 100-point toolbar balance `36886:69133` appears separately over a human-expression photo. Photo backgrounds were generated with built-in image_gen; prompts and provenance live in `assets/cards/habits/`.
- Standard widget: the existing real phone frame is cropped intentionally around the middle of the screen. Five original EN renders from the attached Buddy Widget HTML's `r/` folder are unchanged. The medium slot loops hungry → at risk → in budget; two small widgets stay visible below it. Phone width fits the available art height so widget rows do not collide with the copy.
- 1:1 widgets: two square meal widgets follow the supplied UGC clip's story: breakfast → work lunch/share notification → a shared dinner. Clean food stills come from the supplied clip, with English captions in HTML. A 15-second opacity/translation loop returns to its starting state.

Both widget loops pause independently offscreen, when the tab is hidden, and with reduced motion. Each has an accessible Pause/Play control; the reduced-motion version is a static first state. Original six artwork cards, carousel navigation and the restored Fasting chapter are unchanged.

Validation: build, JS syntax, original-six-card comparison, local asset references, original widget byte comparison, Figma-art lossless pixel/alpha comparison, and motion lifecycle checks pass. Actual desktop/mobile browser rendering remains unverified because this session's browser connection still reports unavailable access despite the user's enabled setting.
