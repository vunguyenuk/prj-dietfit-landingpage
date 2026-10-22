# VI highlights: EN composition, real Asian photography

User request, 22 October 2026: make the VI carousel match EN, replace people with real Asian subjects, and move the section down to the same place in the story.

The VI carousel now contains the same ten topics and 5:7 card proportions as EN, immediately before FAQ. Existing VI product chapters, social/community sections, hero, Rive assets and Deep Scan are retained. The carousel uses the same shared responsive sizing, sticky runway, bounded arrow controls and per-card animation lifecycle as EN. Page section gaps remain 100px.

Seven unmodified stock photographs replace the old flattened VI people cards. Photographer, primary source page, image URL, dimensions and SHA-256 are recorded in `assets/cards/vi-real/source.json`. All people are identified as Asian in the source descriptions. No image generation, face edits, retouching or generative background extension is used. CSS moves the photographs below the copy with a soft upper blend.

Product UI is separate from photography: the exact EN Figma dashboard and opaque product panels are reused, with rounded CSS clips excluding the original photographs; the Streak/Challenge/Fitpoints components and supplied widget visuals use the same assets and geometry as EN. Sharing captions and animation controls are Vietnamese. No replacement person is embedded inside a product panel.

Validation: ten-card structure and placement, all local assets, original main content outside the carousel, unchanged EN main content, photo SHA-256 values, bounded desktop/mobile carousel controls, independent widget pause/play, offscreen/background/reduced-motion behavior, JS syntax, site build and diff whitespace checks. Browser visual review remains unavailable while local browser use is disabled in Work settings.
