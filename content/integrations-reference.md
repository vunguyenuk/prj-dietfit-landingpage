# US integrations section

Replaces only the EN mascot CTA at `#dietfit-video`, 21 October 2026. The Vietnamese page, hero and original native demos are unchanged. The current composition follows the user's staggered square app-grid reference, with the existing Dietfit 3D mascots. Native HTML/CSS composes the cards and characters; no generated imagery is needed.

Apple Health is the bridge. The section does not claim direct Dietfit partnerships with the listed apps, does not display fake connected states, and does not claim every app shares every data category. The main Dietfit copy stays within the existing product's steps, workouts and active-energy scope. On-device access and app-specific permissions determine what is shared.

The official app catalog now calls Fitbit “Google Health (Fitbit)”; this is the label/icon used. Icons are original unmodified JPEG files downloaded directly from the Apple App Store catalog into `assets/integrations/official/`. Each bundle ID, app name and seller was checked on 21 October 2026; download URLs, store pages and SHA-256 hashes are recorded in `assets/integrations/source.json`. No logos are redrawn or recolored. The section uses no connector strokes, per-card arrow badges or rotation. App icons occupy square cells with one quiet border; there are no glass layers.

## Verified provider instructions

- Garmin: https://support.garmin.com/en-US/?faq=lK5FPB9iPF5PXFkIpFlFPA
- Oura: https://support.ouraring.com/hc/en-us/articles/360025438734-Apple-Health-Integration
- WHOOP: https://support.whoop.com/s/article/Apple-Health-Integration?language=en_US
- Polar Flow: https://support.polar.com/en/support/connecting_polar_flow_with_apple_health
- Google Health (Fitbit): https://support.google.com/googlehealth/answer/17037331?hl=en
- Withings: https://support.withings.com/hc/en-us/articles/203728916-Linking-my-Withings-account-to-Apple-Health
- Strava: https://support.strava.com/en-us/articles/15402024-apple-health-and-strava
- VeSync: https://barcode.vesync.com/?v=new-1

Each app card opens its provider's Apple Health instructions. The introduction explains the Apple Health route. Each provider icon still opens its original setup guide. The former sample-data/permissions sentence and “How the connection works” details block were removed at the user’s request; “See how it connects” now links to the app grid.

Motion uses CSS transforms only, pauses offscreen and in background tabs, and is disabled for reduced-motion preferences. Existing mascot motion follows the same visibility/preference rules.


## Motion update — 21 October 2026

The scroll fan-out and sticky runway have been removed. Once at least half the scene enters view, two mascots collect the official app cards from behind the central Dietfit hub, carry them to their positions, and place them. The left mascot places Garmin, Oura, Polar and Withings; the right places WHOOP, Google Health, VeSync and Strava. Both sequences run once. The right helper also carries Apple Health into its central bridge slot after placing the four provider apps. No scroll-progress or reverse-scroll motion remains.

The integration characters now use a dedicated 16-pose transparent atlas, generated from the existing wave mascot with the built-in image_gen tool. The source, prompt, cell extraction coordinates and lossless atlas are saved under `assets/brand/mascots/3d/delivery/`. This is sprite animation, not a rigged 3D model. Other mascot assets and their existing animation are unchanged.

Characters turn through quarter/front views to face their travel direction, alternate four walking poses, bend their knees to pick up, carry using a separate four-pose gait with arms forward, then reach and release. Foot baselines and torso centers are aligned across frames. Walk timing follows distance; the character follows a straight ground path with its contact shadow, without the earlier floating arc. Official app cards remain separate native links and retain their original unmodified logo images. Held cards are uniformly scaled to fit the hands, then grow to their native resting size during placement. Apple Health stays visible as the labeled sharing bridge.

Atlas keyframes use per-segment steps with a linear overall timeline, so every gait frame appears instead of freezing the complete cycle on its first frame. Translation and sprite motion are separate animations. Idle characters breathe subtly; moving characters use the articulated pose cycle. No recurring JavaScript frame loop is needed.

Animations pause offscreen and in background tabs. Keyboard focus, resize or a reduced-motion preference immediately settles the complete layout. Mobile uses the static app grid without travelling mascots; very short desktop windows also show the final scene immediately. If Web Animations or IntersectionObserver is unavailable, the native static scene remains readable.

After the left mascot finishes its own deliveries, it returns home and switches to the original notebook-writing pose. The right mascot returns home and stays in its relaxed, empty-handed pose with subtle breathing. Existing breathing, eye movement and blinking apply to that pose, plus a separate masked forearm/pencil layer with short, irregular writing strokes. The shared mascot visibility controller pauses the gesture offscreen. Reduced-motion users see a still notebook pose.

## Centered grid update — 21 October 2026

Dietfit is again centered in the scene. An 11-column, 7-row staggered grid spans the container around it, with quiet empty square cells and the eight original provider icons. The hub reserves the central columns; helpers rest on either side, with the left writing and the right waving. Apple Health is the ninth carried app and occupies the same square icon cell as other apps, centered in row 7 / column 6 (mobile: row 9 / column 4). Its accessible name and native tooltip identify Apple Health; the former separate “Via Apple Health” caption is removed. There are no glass targets.

On mobile the same composition adapts to seven columns and nine rows, with smaller icons, a central Dietfit hub and Apple Health beneath it. Decorative cells have separate wide/compact positions and are aria-hidden. Mobile/reduced-motion users see the completed static scene with no travelling helpers. Provider links retain accessible labels and native tooltips.

The carousel section follows integrations and precedes FAQ. It is moved in native document order, retaining its existing scroll/touch controls and card artwork.

Icon sizing update: desktop icons grow from 40px to 72px; tablet from 32px to 56px. Mobile icons use up to 40px with 5px cell padding, constrained to the square interior. All nine official icon files are unchanged.
