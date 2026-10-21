# US integrations section

Replaces only the EN mascot CTA at `#dietfit-video`, 21 October 2026. The Vietnamese page, hero and original native demos are unchanged. The reference is the app ecosystem in [0xCal](https://0xcal.app/), with the user's floating-card collage composition and existing Dietfit 3D mascots. Native HTML/CSS composes the cards and characters; no generated imagery is needed.

Apple Health is the bridge. The section does not claim direct Dietfit partnerships with the listed apps, does not display fake connected states, and does not claim every app shares every data category. The main Dietfit copy stays within the existing product's steps, workouts and active-energy scope. On-device access and app-specific permissions determine what is shared.

The official app catalog now calls Fitbit “Google Health (Fitbit)”; this is the label/icon used. Icons are original unmodified JPEG files downloaded directly from the Apple App Store catalog into `assets/integrations/official/`. Each bundle ID, app name and seller was checked on 21 October 2026; download URLs, store pages and SHA-256 hashes are recorded in `assets/integrations/source.json`. No logos are redrawn or recolored. The section uses no connector strokes, per-card arrow badges, card borders or rotation.

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

Dietfit now anchors the center of the scene; the Apple Health card remains the clearly labeled sharing bridge. Provider tiles expand from Dietfit to their resting positions as the scene enters the viewport. Hover/focus gently floats a single tile. Original official app artwork remains unchanged, without connector strokes or arrow badges. The collage gains 48–72px of space below its intro. Reduced-motion users see the fully expanded, static layout; keyboard focus immediately reveals any provider tile.
