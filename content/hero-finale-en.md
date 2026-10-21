# EN hero: shared-element meal-plans sequence

Reference: user-supplied `/Users/vunguyen/Desktop/meal-plans.mp4` (6.47 seconds), examined frame by frame, including its nutrient transfer and phone-to-dashboard assembly. Dietfit retains its own meal, typography, product data and artwork.

The EN hero uses a 900svh natural sticky runway. Capture and Deep Scan occupy the first 62%. The next 32% drives the finale, then the final 6% holds the completed dashboard before the sticky stage releases.

The finale is a pure function of scroll progress:

- 0–24.5%: mascot peeks, waves and hides above the phone.
- 27–38%: one calorie-budget panel moves out beside the phone.
- 31–49%: a meal photo and result sheet slide up inside the phone. Ingredient labels attach to the photo.
- 49–68%: colored nutrient dots move from the meal's macros to the budget; its ring, food total and macro values update. The reviewed 620 kcal meal changes food from 990 to 1,610 kcal, leaving 590 kcal against a 2,000 goal plus 200 activity calories.
- 72–88%: the **same budget and same result panel** translate and scale into their dashboard positions. Only the phone hardware fades away; the result and budget remain fully opaque. There is no second copy of either UI underneath them.
- 83–93%: the enclosing dashboard surface expands behind those panels, the title is uncovered and Meal plan opens below the budget.
- 93–100%: completed dashboard stays readable.

This replaces the previous whole-phone/dashboard crossfade, which produced doubled translucent text and images at intermediate scroll positions. The dashboard does not have an opacity animation. Its budget and journal have exactly one DOM instance each throughout the sequence. Layout is measured only on setup, image decode and resize; per-frame movement uses transforms, small clip reveals and the hardware opacity. Existing Rive exports remain unchanged and pause before the native many-card burst. VI behavior is unchanged.

No timers, autoplay, wheel cancellation or scroll lock drive the finale. A stationary scroll position freezes all movement and counters, and reverse scrolling restores the earlier meal and budget state. Reduced motion retains the static poster. The rounded dark scene is separate from the shared panels, allowing the calorie card to extend beyond its edges.

Validation: deterministic non-zero geometry tests cover shared identities, opaque docking at intermediate frames, nutrient flight, total arithmetic, stationary state, reversal, desktop/compact native handoff, resize and reduced motion. Deep Scan regression, syntax, site build and live browser checks are also run.
