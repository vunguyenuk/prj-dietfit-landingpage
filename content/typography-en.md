# English landing typography — 21 October

`styles/dietfit-type-scale-en.css` loads last and owns page headings. Be Vietnam Pro remains the approved font. Native app UI is excluded from these selectors.

- Hero: 2.5–3.75rem, weight 600, line-height 1.12.
- Section titles (feature intro, five features, before/after, integration, FAQ and final CTA): one 2–2.25rem desktop scale, weight 600, line-height 1.15 and -.035em tracking.
- Carousel titles: 1.25–1.5rem, weight 600 and line-height 1.2.
- Mobile: hero 2.125–2.75rem; sections 1.75–2.125rem; card headings 1.25rem.
- Feature, comparison and integration body text: 1rem with 1.6 line-height. Comparison body is limited to 60ch (36ch on mobile); emphasized copy uses weight 500.

Desktop root sizing still follows the existing large-screen scale, so rem values grow with the device frame. The section cap reduces the oversized feature headings and replaces the separate hard-coded 52px comparison/FAQ sizes. Cards grow approximately 10% in width on wide desktops while preserving their 5:7 ratio; the latest readability request supersedes the earlier four-full-card count.

Build and source checks pass. The latest type/card adjustment has not been re-rendered because browser access became unavailable after the earlier successful desktop review.
