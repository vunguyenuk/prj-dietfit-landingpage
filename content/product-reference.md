# Product story reference

## Direction

Vietnamese Gen Z and young adults; encouraging, warm and specific. Preserve the existing project's visual identity and original Rive hero. Sara is the recurring guide. Explain behavior with inspectable product examples before asking visitors to install.

Content progression was informed by https://0xcal.app/ (reviewed 20 October 2026). Its accuracy results, privacy promises, technical mechanisms, comparative claims and customer numbers are not Dietfit evidence and have not been reused.

## Dietfit sources

- Existing `prj-dietfit-landingpage`: typography, orange palette, rounded surfaces, header, language switch, hero Rive, company/blog routes, community links and App Store destination.
- `dietfit-landing-page-v2`: Deep Scan flow, ingredient review, native app device presentation, Sara conversation structure, Meal Plan swaps/logging, home gauge/activity UI; original mascot and six meal photographs.
- `ScreenRecording_09-29-2026 15-52-41_1.mov`: real shrimp and black sticky rice Deep Scan; four ingredients, 358 kcal, review/edit action. Website recording retains the full ~32 seconds, without audio.
- `ScreenRecording_10-02-2026 20-59-54_1.MP4`: Quick Scan and Deep Scan introduction. Website recording uses seconds 3–43.
- `ScreenRecording_10-03-2026 22-58-58_1.MP4`: Sara's context about food, sleep and activity. Website recording uses seconds 80–114, ending before the photo picker. Guided demo conversations are localized adaptations, not a connection to live AI.
- User-supplied product structure: personalized onboarding, saved meals, health connections, streaks/challenges/Fitpoints, widgets, Food Story, reports, fasting, meal plans and Vietnam Social Feed.

## Evidence boundaries

- The supplied Figma page is [Scan Meal Flow + Meal Detail](https://www.figma.com/design/ME5fBUsja6zeetzKPGUZPE/Prj-DietFit---Production-Sync?node-id=25395-22061). Its public web view is accessible. Visual review found Ingredients (`36888:104806`, 375×812) and a Meal Detail group containing both Current and New variants (`30487:121567`). The Ingredients design shows food pins with gram weights, ingredient thumbnails and a calculate-calories action; the supplied newer recording shows outlines and calories per ingredient. The website demonstration intentionally follows the supplied recording/v2 flow, as requested, rather than combining states from different variants.
- The Figma connector still rejects `get_design_context` for this file because its authenticated account lacks edit access. No exact design-token or asset export is claimed. Browser viewing does not provide the missing connector permissions; precise Figma implementation remains pending that access.
- Ingredient weights and macros in the UI replay are sample values; no accuracy percentage is claimed.
- Home values (2,329 goal, 460 consumed, 7,698 steps, 1h 24m run, 7h 16m sleep) are demo context from v2/the recording. The weight graph is clearly labeled illustrative and is not a user result or a weight-loss promise.
- A meal plan does not count as a logged meal until the visitor presses its log button. Swapping a previously logged sample clears that meal's logged state.
- Streaks and projections shown in the widget are sample values, not real account rewards or guaranteed results.
- Community destinations remain the Dietfit links present in the original project. There are no invented reviews, expert endorsements, growth figures or benchmark claims.

## Editing and validation

Both home pages contain editable semantic HTML; the script only controls the demonstrations. Keep their content synchronized. Rebuild SEO/FAQ data with `python3 tools/build.py` after content changes. Verify the original Rive files, script, stylesheet and hero markup remain unchanged when editing the product story.


## Final reference contract — 20 October 2026

The user rejected the later visual reinterpretations. The current revision restores v1's actual page components and design system from `909d84a`: white backgrounds, Dietfit orange, Be Vietnam Pro, original people/photo carousel, social content, progress imagery, community and photo footer. The FAQ uses the existing v1 layout with six fact-checked product answers. The carousel reward copy now describes streaks/challenges/Fitpoints rather than the old calorie rollover claim.

Gaia supplies composition only: alternating text/device columns and Sara at selected outside edges. No Gaia assets, colors, fonts or scripts ship.

V2's local `runner-camera-v87` and deployed https://dietfit-landing-page-v2.vercel.app/ supply the app UI and internal timelines. `dietfit-native-ui.js` adapts `phoneFlow`, `saraScene`, `dayScene`, and `runnerPhoneScene` from v2 `app.js`; CSS preserves the 395×832 device / 375×812 app coordinates inside `.df-native`. Only required food photos, app type, icon and mascot assets are copied. No global v2 stage, wheel hijacking, painted scenery, historical characters or orb page theme is imported.

- Scan: camera → scanning band → colored ingredient paths/popovers → ingredient sheet → calculating → nutrition details/scroll. The plate photo, labels and 558 kcal result refer to the same sample meal.
- Sara: typed question → sent sashimi photo → typing → word reveal → follow-up → daily summary. Sample recorded conversation, not a live AI chat.
- Meal Plan: scroll swaps breakfast/lunch/dinner and demonstrates logging; direct Swap/Tick controls take priority. A planned meal is not counted as logged until ticked.
- Connected Health: counters/arc/activity cards then dinner suggestions; tab selection, meal selection, log and undo use the original functional demo.
- Widgets: staggered reveals, macro bars and trend stroke tied to chapter progress.

Progress is driven by document scroll on desktop/tablet/mobile, in either direction. On mobile the copy leaves first and the phone pins at readable size. Stage controls provide a direct alternative, and a resume button returns to scroll control. Reduced-motion mode renders stable screens and retains controls. No timed compact autoplay substitutes for the scroll sequence.

Original hero markup and all hero assets/runtime files are verified byte-identical to the pre-change backup. Both languages are updated. Validation includes source links/IDs/ARIA/FAQ schema, JavaScript syntax, actual browser UI interaction and responsive iframe viewports. Previous `dietfit-product.*` / `dietfit-ui-motion.*` modules remain in Git/source history but are no longer loaded by Home.
