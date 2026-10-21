# EN feature phone sizing and companion placement

Deep Scan, AI Coach, Connected Health, Meal Plan and Intermittent Fasting use equal two-column layouts, the same 395 × 832 device coordinate system and the same fit calculation. The desktop scale limit grows smoothly from 1.15 at 1440px to at most 2; the actual fit is also constrained by stage height and column width. The compact-device fit remains unchanged.

External companions sit in an absolute layer behind the phone rather than consuming a second lane. They peek from the inward edge, with overlap and feet near the phone baseline. The companion cap grows with the desktop type scale, retaining the original focused-writing and waving artwork and animation. Tablet/mobile decorative companion hiding remains intact. Intermittent Fasting replaces the former Widgets chapter and uses a full phone without an external companion.

Earlier browser measurements confirmed equal phone sizes across the four preceding phone chapters at desktop, tablet and mobile sizes. The new fifth phone uses that same fit function. DOM checks verify fasting controls, scroll progression/reversal, manual interaction/resume, reduced motion and the unchanged VI renderer. Final browser geometry QA is pending because this session's browser connection is unavailable despite the enabled setting.


## Alternating composition restored — 21 October, 21:25

After the Notion chapter reorder, Connected Health retained its old flipped class and Meal Plan retained its old unflipped class, creating consecutive devices in the same column. The desktop sequence is now explicitly right / left / right / left / right for Deep Scan, AI Coach, Connected Health, Meal Plan and Fasting. The writing companion moves to the inward right edge of the left-side Meal Plan phone, preserving the original unmirrored artwork. Mobile retains its centered copy-then-device layout. Copy, phone scale, section gaps and scroll animations are unchanged.


## Restored Widgets visual in the Fasting chapter

Latest user feedback restores the former visual from the reference screenshot while retaining the Fasting heading, kicker, body and `#dietfit-fasting` anchor. The original EN stage markup from `0de06de^` is reused: Today calorie widget, dark Streak widget, full-width trend chart, meal photo and the exercise/waving companion. The section uses the existing `widgets` scroll renderer, including card/bar/chart reveal and reversal, instead of the fasting phone renderer.

Desktop restores the wider visual column (.82/1.18 copy/visual ratio) and gives the companion its own lane. The widget fit calculation now measures its actual native column, reserving the companion's width; phone chapters retain their common sizing. Tablet/mobile retain the established single-column layout and companion hiding. VI markup and behavior remain unchanged.

Validation compares the restored stage to the previous stage markup, verifies unchanged Fasting copy, four widgets and the companion, and exercises scroll reveal/reverse, reduced motion and mascot lifecycle. Build and syntax checks pass; full-browser verification remains unavailable through this session's connection.
