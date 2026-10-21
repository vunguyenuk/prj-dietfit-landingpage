# EN feature carousel sizing

The carousel stays between integrations and FAQ. It retains the six previously approved artwork cards, followed by four daily-habit cards from the supplied Notion copy: streaks, challenges/Fitpoints, reminders and shared meals. The new cards use live text and native HTML product vignettes with existing Dietfit assets.

Desktop prioritizes readable artwork and copy: approximately three complete cards plus a hint of the next below 1800px, with 20px gaps and basis `(100% - 60px) / 3.2`. At 1800px and wider, basis `(100% - 60px) / 4` restores four complete cards inside the growing frame, retaining fluid type rather than shrinking the copy. The 5:7 artwork ratio is preserved; card height is also limited to viewport height minus 200px so a wide, short display can show more cards without clipping their bottoms. Tablet uses two-card width and mobile one-card width.

Desktop headings are 1.25–1.5rem, body copy 1rem and padding 1.25–1.5rem, following the fluid desktop type scale. At the earlier 1240px frame, the reference card size was 368.75 × 516.25px. The fluid frame now increases card size where viewport height permits. Original artwork is unchanged, and scroll pinning plus arrow navigation remain intact.

DOM checks verify four new cards and their source copy. Final wrapping/readability QA for all ten cards still requires a browser; this session's browser connection is currently unavailable in Work settings.
