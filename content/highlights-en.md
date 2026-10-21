# EN feature carousel sizing

The six original Figma cards remain between integrations and FAQ. Desktop (1024px and wider) shows four complete cards in the shared container, using a 16px gap and `flex-basis:calc((100% - 48px) / 4)`. At the 1240px page maximum, each card is 298px wide and 417.2px tall, retaining its original 5:7 artwork ratio.

Desktop copy uses a 17–20px heading, 13px body and 14–20px padding. Tablet shows two complete cards; mobile retains one card with native touch scrolling. Original artwork and six-card order are unchanged. Desktop arrow controls use the existing Lenis scroll controller so native smooth scrolling does not compete with the page’s scroll animation. The pinned carousel content is vertically centered so its smaller cards do not sit at the top of a mostly empty sticky stage.

Validation: live desktop measurement confirms four fully visible cards at the start of the carousel; 298px card width, 16px gaps, 1240px frame. Site build and diff whitespace checks pass.
