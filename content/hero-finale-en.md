# EN hero greeting and floating UI

The EN hero keeps the existing Rive capture/analysis sequence. Before the native surrounding cards begin (frame 375 of the 539-frame work area), the EN controller holds at frame 374 (compact export: frame 799 before its first card move at 800, in its 1925-frame work area) and shows the final phone scene using the existing embedded phone artwork and localized UI images.

The finale runs once per visit to that point:

- 0–480 ms: mascot peeks from behind the top of the phone.
- 480–1720 ms: two gentle hand waves.
- 1720–2200 ms: mascot disappears behind the phone.
- 2200–2360 ms: short pause, all surrounding cards still hidden.
- 2360–3660 ms: surrounding cards spread from the phone with a small stagger and smooth acceleration/deceleration.

The ingredient list continues responding to scroll after the greeting gate. Scrolling back before the gate resets the greeting. Offscreen/hidden tabs pause the sequence instead of consuming it unseen. It shares the hero's existing animation frame loop.

The rounded backdrop, phone and floating cards are separate layers. Only the phone screen and mascot peek aperture clip their contents. The outer cards can extend past the black backdrop, while staying at least 8px inside the viewport. Tablet and mobile have separate card positions. Reduced motion uses the existing static hero poster.

`assets/hero/finale/source.json` records the original artwork sources. The UI is copied exactly from the current EN image set; all original Rive exports and the VI hero remain unchanged.

Validation: build, JavaScript syntax, greeting/reveal ordering, hidden/offscreen pause/resume, reverse reset/replay, final card transforms, continued screen scrolling, asset paths and EN-only wiring. Browser visual QA is pending because local browser use is disabled in Work settings.
