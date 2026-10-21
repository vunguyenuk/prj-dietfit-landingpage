# EN section containers

The shared frame started from the 1240px / 92vw reference observed at https://0xcal.app/ on 21 October 2026. The latest user request expands that frame for larger displays rather than preserving a fixed laptop maximum.

`--dietfit-page-max: clamp(1240px, calc(75vw + 160px), 2400px)` and `--dietfit-page-width: min(var(--dietfit-page-max), 92vw, 92%)` now govern the header, intro, hero, metrics, product heading, feature wrappers, progress gallery, integrations, carousel, FAQ and final shell. Expected maximum widths are 1240px at a 1440px viewport, 1600px at 1920px, 2080px at 2560px and 2400px at 3840px. Viewport dimensions govern adaptation because physical display inches cannot be detected reliably by CSS.

Above 1440px, type grows smoothly from the visitor's default to at most 150%. Phone fitting is shared by all five feature chapters and constrained by available width and viewport height. Integration tiles, icons and mascots grow within the same frame. The carousel retains its 5:7 artwork ratio and caps its height to the sticky viewport.

The before/after gallery fills the frame using the original images with width:100% and height:auto. People are neither cropped nor redrawn, stretched or retouched. Narrow reading measures and phone proportions remain intentional inside the common frame.

`dietfit-section-gaps-en.css` is loaded last and sets 100 CSS px between top-level content sections, between the feature introduction and its chapters, and between adjacent feature chapters. It removes older additive vertical section padding. Pinned sections retain the scroll runway required to finish their animation before the next section; this runway is not extra inter-section margin.

Earlier live browser audits verified common edges at laptop, tablet and mobile sizes. A preliminary 2560px fluid-frame check measured 2080px throughout. The final copy/spacing revision has code and DOM checks only: local browser use is disabled in Work settings, so final rendered alignment, text wrapping and overflow still need browser QA.
