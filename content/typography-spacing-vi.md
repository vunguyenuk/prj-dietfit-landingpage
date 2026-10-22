# Vietnamese home sizing and spacing — 22 October 2026

The VI homepage follows the approved EN typography and spacing scale while retaining Vietnamese copy, original photos, original Rive exports and native app screen typography.

- Hero: 40–60px desktop, 34–44px mobile. Section headings: 32–36px desktop, 28–34px mobile. Card headings: 20–24px. Body copy: 16px. Sizes use rem-based fluid tokens.
- Shared content frame, 100px section separation, 16–24px copy gaps and consistent card padding. Hero and footer have equal 20px outer frames.
- Cards use the EN 5:7 proportions and viewport fit. Comparison photos fit their column without cropping. Navigation logo is centered without an inline-image baseline gap.
- VI joins the existing EN device sizing path so all four phones occupy the same scale at each breakpoint; widget companions retain a separate lane. Native UI markup and renderers retain their content and timeline behavior.

Validation: build of all 18 pages and diff checks passed. Existing Notion/chapter order, motion reverse, interaction and reduced-motion checks passed, along with native scan geometry checks. Browser review at 320×740, 390×844, 768×1024, 1512×823 and 1920×1080 found no horizontal or heading text overflow; four phone widths match at each breakpoint. Hero/footer edges measure 20px on desktop and mobile; footer top/bottom gaps measure 20px within subpixel rounding.

Screenshots: `/Users/vunguyen/Desktop/prj-dietfit-review-2026-10-20/vi-type-spacing-desktop.png`, `vi-feature-sizing-desktop.png`, `vi-type-spacing-mobile.png`, `vi-cards-spacing-desktop.png`.
