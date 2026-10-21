# EN section containers

Reference checked on 21 October 2026: https://0xcal.app/ uses `.wrap { width:min(1240px,92vw); margin:0 auto }` for its main section frame.

The EN landing page now uses the same rule through `--dietfit-page-width`, shared by the intro, header nav, hero, metrics, carousel wrapper, product heading, all five feature wrappers, sample-data note, progress wrapper, integrations and FAQ, and final CTA/footer shell. Its maximum is 1240px; below that, the frame stays within 92% of available width (also capped at 92vw so desktop scrollbars cannot consume the mobile gutter). A single late-loaded stylesheet owns these widths and removes extra section-level horizontal padding.

The before/after gallery now fills the common outer frame instead of stopping at 832px. Each original photo scales proportionally with width:100% and height:auto; no person is cropped, redrawn, stretched or retouched. The original files are unchanged. Phone screens, icon grid cells and readable text measures retain their intended proportions inside the common frame. The feature-copy wrapper now stretches to its grid-column edge, removing an extra centered inset, and the intro title wraps within its container. The hero's background clipping remains separate from its overflowing UI cards. Header pill insets, scrolling timelines and the VI page are unchanged.

Live Chrome audit (1512px viewport, 1497px document width): intro, hero, metrics inner, all five features, progress wrapper/gallery, integrations inner, carousel wrapper, FAQ and footer outer shell are each 1240px wide at x=128.5px.

Responsive verification: Chrome at 390×844 and 1024×900 has no horizontal document overflow. At tablet width, the gallery, integrations frame/grid and FAQ share x=33.46px and width=942.08px; desktop is 1240px throughout. The original before/after natural ratio is 0.376278 and the rendered ratio is 0.376280, within pixel rounding.
