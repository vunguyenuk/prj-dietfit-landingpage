# EN feature carousel sizing

The carousel stays between integrations and FAQ. Six approved artwork cards are followed by four daily-habit cards from the supplied Notion copy: streaks, challenges/Fitpoints, reminders and shared meals. Original artwork remains unchanged.

The latest request increases card width slightly: desktop uses `(100% - 60px) / 3`; at 1800px and wider, `(100% - 60px) / 3.6`. This supersedes the earlier four-full-card target. Cards preserve the 5:7 ratio and cap their height at viewport height minus 160px. Tablet uses two-card width (height cap svh minus 200px); mobile uses one-card width in the shared frame. Scroll pinning and arrow navigation remain.

Page titles follow the shared EN heading scale. Card headings are 1.25–1.5rem desktop and 1.25rem mobile; desktop body is 1rem, with 1.25–1.5rem padding.

The four live habit cards use two grid rows: natural-height copy followed by a `minmax(0,1fr)` preview area. Each preview fits both the available width and height; its inner query container scales vignette typography with the fitted width. This removes the former fixed 37% art offset, which could overlap longer copy. App/meal images retain square proportions.

Source/DOM and build checks pass. Final visual verification of the newest type/card layout remains pending because this session's browser connection is unavailable despite the user's enabled setting.
