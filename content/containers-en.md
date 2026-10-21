# EN section containers

Reference checked on 21 October 2026: https://0xcal.app/ uses `.wrap { width:min(1240px,92vw); margin:0 auto }` for its main section frame.

The EN landing page now uses the same rule through `--dietfit-page-width`, shared by the intro, header nav, hero, metrics, carousel wrapper, product heading, all five feature wrappers, sample-data note, progress wrapper, integrations and FAQ, and final CTA/footer shell. Its maximum is 1240px; below that, the gutter is 4vw per side. A single late-loaded stylesheet owns these widths and removes extra section-level horizontal padding.

Nested artwork such as the original before/after photos, phone screens, icon grid and readable text measures retain their intended proportions inside the common outer frame. The hero's background clipping remains separate from its overflowing UI cards. Header pill insets, scrolling timelines and the VI page are unchanged.
