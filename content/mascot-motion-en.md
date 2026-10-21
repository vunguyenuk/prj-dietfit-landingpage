# EN character idle animation — 21 October 2026

The existing character imagery now uses a native, layered 2D rig for EN idle behavior. This is not a new 3D model or skeletal 3D export. The game-character quality comes from anticipation, overlapping motion and nonuniform timing, while retaining the supplied art style.

Each character has a torso, an independently moving head, facial layers and a separate grounded feet layer. Existing wave/exercise limb cutouts are retained. Writing characters additionally have a notebook restore layer and a separately moving pencil/forearm layer. Overlapping masks keep the neck and ankles opaque. Foot placement and the external ground shadow stay fixed while the upper body transfers weight.

An idle gesture follows this order: eyes glance at 10% of the gesture, torso settles into its weight shift at 43%, head follows at 52%, then everything returns to rest at different times. Arms anticipate and make a larger greeting with a smaller follow-through. Writing uses short clusters of pencil strokes and pauses, with a downwards glance and a small head lean. Breathing continues independently; the gesture intervals vary by character. Occasional double blinks interrupt the regular single-blink pattern.

All finite animations use Web Animations transform/translate/rotate properties. A separate per-character timeout schedules each gesture; there is no requestAnimationFrame loop for idle behavior. IntersectionObserver, zero-width geometry, document visibility and reduced-motion settings cancel timers and active gestures. Reduced motion restores the complete original bitmap masks, hides the added rig layers and leaves the edited writing expression static. Legacy Vietnamese mascots keep their previous behavior.

EN writing characters reference `assets/brand/mascots/3d/focused/writing-tongue.webp`: a built-in image_gen edit of the original writing pose with eyes directed toward the notebook and a small tongue at the screen-right mouth corner. Its original PNG and complete generation prompt are saved beside the production WebP. Original pose assets remain unchanged.

Integration helpers keep their walking/carrying atlas while delivering app cards. After deliveries, the left helper uses the focused writing rig; the right uses the original empty-handed wave rig. Official logos, temporary glass targets and their paint order remain unchanged.

EN waving poses use a clear three-swing greeting (−16° to +32° over 2.1–2.55s), with a small shoulder lift and grounded feet. Exercise poses retain their existing smaller arm gesture. The hero peek also uses a stronger two-wave greeting before it hides.
