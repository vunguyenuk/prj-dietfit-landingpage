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

- The Figma connector reported missing access to file `ME5fBUsja6zeetzKPGUZPE`. No Figma node was invented, and the implementation does not claim a pixel-perfect match to inaccessible frames. The app UI is grounded in the supplied recordings and landing v2.
- Ingredient weights and macros in interactive examples are sample values. Calorie changes are proportional to edited weights; no accuracy percentage is claimed.
- Home values (2,329 goal, 460 consumed, 7,698 steps, 1h 24m run, 7h 16m sleep) are demo context from v2/the recording. The weight graph is clearly labeled illustrative and is not a user result or a weight-loss promise.
- A meal plan does not count as a logged meal until the visitor presses its log button. Swapping a previously logged sample clears that meal's logged state.
- Streak interaction changes sample browser state only. It does not grant real Fitpoints or modify an account.
- Community destinations remain the Dietfit links present in the original project. There are no invented reviews, expert endorsements, growth figures or benchmark claims.

## Editing and validation

Both home pages contain editable semantic HTML; the script only controls the demonstrations. Keep their content synchronized. Rebuild SEO/FAQ data with `python3 tools/build.py` after content changes. Verify the original Rive files, script, stylesheet and hero markup remain unchanged when editing the product story.
