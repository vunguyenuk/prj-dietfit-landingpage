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
- Ingredient weights and macros in interactive examples are sample values. Calorie changes are proportional to edited weights; no accuracy percentage is claimed.
- Home values (2,329 goal, 460 consumed, 7,698 steps, 1h 24m run, 7h 16m sleep) are demo context from v2/the recording. The weight graph is clearly labeled illustrative and is not a user result or a weight-loss promise.
- A meal plan does not count as a logged meal until the visitor presses its log button. Swapping a previously logged sample clears that meal's logged state.
- Streak interaction changes sample browser state only. It does not grant real Fitpoints or modify an account.
- Community destinations remain the Dietfit links present in the original project. There are no invented reviews, expert endorsements, growth figures or benchmark claims.

## Editing and validation

Both home pages contain editable semantic HTML; the script only controls the demonstrations. Keep their content synchronized. Rebuild SEO/FAQ data with `python3 tools/build.py` after content changes. Verify the original Rive files, script, stylesheet and hero markup remain unchanged when editing the product story.


## Mascot and human imagery pass — 20 October 2026

The supplied local Gaia capture was reviewed for composition: characters peek at section edges, direct attention to a product action, and change scale with their role. Dietfit keeps its own palette, typography, Sara artwork and product UI; no Gaia brand assets or scripts are included.

- Introduction: restore the original high-resolution woman-with-phone photograph, with Sara greeting the visitor at its lower edge.
- Scan: place Sara below the phone as an instruction companion, clear of the interactive UI.
- Coach: retain Sara as the conversation identity and contextual guide.
- Motivation: move Sara onto the edge of the streak board with an encouraging speech bubble.
- Community: restore the original group photograph and Nguyễn Trà My partner video, retaining attribution and native playback controls. Lifestyle photography is illustrative; no fabricated testimonial or result is added.
- Download: restore an everyday phone-use scene beside the CTA, with Sara saying goodbye.

Both VI and EN home pages share this composition. Existing raster mascots stay at or below their source dimensions. The original Rive hero, demo logic, About and Blog pages remain unchanged. The supplied Gaia capture stays untracked as a reference folder and is not part of the production change.
