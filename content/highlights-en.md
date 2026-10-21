# EN feature carousel sizing

The six original Figma cards remain between integrations and FAQ. Desktop (1024px and wider) now prioritizes readable artwork and copy: three complete cards plus a portion of the next card, with a 20px gap and `flex-basis:calc((100% - 60px) / 3.2)`. At the shared 1240px maximum, each card is 368.75 × 516.25px, retaining its original 5:7 artwork ratio. This is about 24% larger in each dimension than the earlier four-card treatment.

Desktop headings are 20–24px; body copy is 16px with 1.5 line height, and padding is 20–24px. Tablet still shows two cards and mobile one. Original artwork, six-card order, pinned scroll and existing Lenis arrow navigation are preserved.

Validation: live desktop measurement confirms 368.75px card width, 516.25px height, 20px gaps, 24px headings and 16px body copy inside the shared frame. Site build and whitespace checks pass.
