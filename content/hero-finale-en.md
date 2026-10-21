# EN hero: scroll-only meal-plans sequence

Reference: user-supplied `/Users/vunguyen/Desktop/meal-plans.mp4` (6.47 seconds). Its choreography is capture → ingredient identification → one supporting macro card → phone result sheet → compact nutrition dashboard. Dietfit uses its own existing meal, phone and product artwork for the same sequence.

The EN hero now has a 900svh natural sticky runway. Progress starts only when the hero reaches the top of the viewport, rather than 188px before it. Capture and Deep Scan occupy the first 62% of that runway. The next 32% drives the greeting, result and dashboard; the final 6% holds the completed dashboard for reading before the sticky stage releases and the next section enters.

The finale is a pure function of scroll progress:

- 0–4.5%: mascot peeks above the phone.
- 4.5–19%: the larger hand waves follow scroll.
- 19–24.5%: mascot hides completely.
- 27–47%: one calorie-budget card emerges beside the phone.
- 33–63%: the phone's ingredient result scrolls internally.
- 66–85%: phone and supporting card move into the journal and budget positions of the compact dashboard, using measured target bounds and transform-only scaling.
- 85–100%: completed dashboard stays readable.

The dashboard has a calorie budget, three-row meal plan and one food-journal entry. Nine of the previous ten floating cards have been removed from the DOM. No elapsed-time counters, autoplay, gesture timers, scroll cancellation or wheel interception drive this chapter. Stop scrolling and its state stops; scroll backward to reverse it. The original Rive exports are held before their native card burst and remain byte-identical. VI behavior is unchanged.

The rounded background and UI layers remain separate, so the supporting card can extend beyond the black scene without clipping. Reduced-motion users retain the static poster.

Validation: source checks, desktop/compact native handoff, deterministic stationary state, reverse playback, all phase boundaries, reduced motion, site build, and live Chrome inspection of the pinned stage and final dashboard.
