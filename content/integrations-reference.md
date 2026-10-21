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

Each app card opens its provider's Apple Health instructions. The inline disclosure explains permissions; the native details section explains the three-step route. Its introductory link also opens the details so the user can read the setup immediately.

Motion uses CSS transforms only, pauses offscreen and in background tabs, and is disabled for reduced-motion preferences. Existing mascot motion follows the same visibility/preference rules.


## Motion update — 21 October 2026

The scroll fan-out and sticky runway have been removed. Once at least half the scene enters view, two mascots collect the official app cards from behind the central Dietfit hub, carry them to their positions, and place them. The left mascot places Garmin, Oura, Polar and Withings; the right places WHOOP, Google Health, VeSync and Strava. Both sequences run once. No scroll-progress or reverse-scroll motion remains.

The integration characters now use a dedicated 16-pose transparent atlas, generated from the existing wave mascot with the built-in image_gen tool. The source, prompt, cell extraction coordinates and lossless atlas are saved under `assets/brand/mascots/3d/delivery/`. This is sprite animation, not a rigged 3D model. Other mascot assets and their existing animation are unchanged.

Characters turn through quarter/front views to face their travel direction, alternate four walking poses, bend their knees to pick up, carry using a separate four-pose gait with arms forward, then reach and release. Foot baselines and torso centers are aligned across frames. Walk timing follows distance; the character follows a straight ground path with its contact shadow, without the earlier floating arc. Official app cards remain separate native links and retain their original unmodified logo images. Held cards are uniformly scaled to fit the hands, then grow to their native resting size during placement. Apple Health stays visible as the labeled sharing bridge.

Atlas keyframes use per-segment steps with a linear overall timeline, so every gait frame appears instead of freezing the complete cycle on its first frame. Translation and sprite motion are separate animations. Idle characters breathe subtly; moving characters use the articulated pose cycle. No recurring JavaScript frame loop is needed.

Animations pause offscreen and in background tabs. Keyboard focus, resize or a reduced-motion preference immediately settles the complete layout. Mobile uses the static app grid without travelling mascots; very short desktop windows also show the final scene immediately. If Web Animations or IntersectionObserver is unavailable, the native static scene remains readable.

After the left mascot finishes its own deliveries, it returns home and switches to the original notebook-writing pose. The right mascot returns home and stays in its relaxed, empty-handed pose with subtle breathing. Existing breathing, eye movement and blinking apply to that pose, plus a separate masked forearm/pencil layer with short, irregular writing strokes. The shared mascot visibility controller pauses the gesture offscreen. Reduced-motion users see a still notebook pose.

## Staggered grid update — 21 October 2026

The glass mounting targets and all their animation state were removed. The eight official icons now occupy equal square cells in a staggered 5 × 5 grid, with four quiet, decorative empty cells matching the supplied reference. All cells are fixed targets: mascots still collect each app from Dietfit and carry it to its cell. The left helper writes after its deliveries; the right helper waves. Their resting positions sit beside Dietfit, clear of the finished icon grid.

Rows/columns: Garmin (1,2), Oura (1,4), WHOOP (2,3), Polar (2,5), Google Health (3,2), VeSync (3,4), Withings (4,3), Strava (5,2). Empty cells are aria-hidden presentation elements at (2,1), (4,1), (4,5), (5,4). App labels remain available in each link's accessible name and native tooltip; only the original official icon is visible in the cell.

Desktop places Dietfit and its helpers beside the grid. Tablet stacks the grid above Dietfit and the resting helpers. Mobile keeps the same staggered pattern with fluid cell sizes and no travelling mascots. The single cell border stays at the destination while an icon is carried; it has no glass gradient, doubled frame or mounting fade.
