# Benchmarks UI consistency review — 28 October 2026

Reviewed the live `/en/benchmarks/` page at 1440px and 390px, with additional DOM checks at 768px and 320px. This is a review; the page was not modified.

## Verdict

The Dietfit palette and Be Vietnam Pro typography are coherent. Overall UI consistency is partial: about 7/10 as a qualitative design judgement. The strongest discontinuity is the transition from inset peach dashboard sections to flat editorial report sections. The references have been translated into the correct brand colors, but the entire page still needs a shared composition and density system.

## Anti-pattern assessment

No gradient text, decorative glow, burgundy theme or green theme remains. The large nested white cards and repeated headline KPI numbers make the opening feel like a general dashboard. The later report sections have a different, flatter visual rhythm. Variety in layout is appropriate; making every section another peach card would not solve the hierarchy problem.

A deterministic static scan reported 26 flags: 7 low contrast, 10 cramped padding, 8 tiny text, 1 repeating stripe. These are detector flags, not 26 confirmed defects. Many padding findings mistake structural wrappers/divider rows for content boundaries. Gauge text sits on a white pseudo-element, so its reported contrast against the orange ring is a false positive. The repeating gradients draw functional chart axes/gauge ticks. The detector's live-overlay command was unavailable; no user-visible overlay was installed.

Confirmed small details: chart axes 10px, hints/notes 11px, 24px dot targets; the footer CTA's light text on orange has about 2.7:1 contrast. No full-page horizontal overflow was found at the four tested widths.

## What works

- Orange `#ff692e`, peach `#fff4ee`, white and ink `#110b20` are used consistently; competitor logos correctly retain their original colors.
- Major report headings use 40px desktop and 28–29px mobile; the type family and heading weight are consistent.
- Dot plots, example gauge and meal outlines share the orange accent. Navigation, methodology sources and FAQ remain recognizable and useful.

## Priority issues

### P2 — Section framing and alignment change halfway down

The scoreboard and meal example have 32px peach shells with 24px inset white cards. Text logging, methodology and FAQ use flat white surfaces with neutral dividers. At 1440px the meal heading starts at x136, whereas later section headings start at x96.

**Fix:** establish one section-heading grid and spacing rhythm. Keep the requested dot plots/gauge and allow purpose-specific layouts, but use consistent title insets and clear roles for peach surfaces, white cards and borders. Avoid enclosing every section in more cards.

Suggested work: `/layout`, then `/polish`.

### P2 — Mobile summary is too long before the concrete meal example

At 390px the overview is approximately 2210px tall. Summary and chart cards stack as four separate blocks. The visible plot region is approximately 300px wide, while the full photo/text plots are approximately 452/592px. Users initially see only two of the app columns.

**Fix:** merge each summary and plot into a more compact mobile unit, remove repeated padding/numbers, and make app comparison discoverable without several screens of scrolling. Preserve all app logos, values and dot interactions.

Suggested work: `/adapt`, `/distill`.

### P2 — Dense point targets require a different touch treatment

Dots have 24×24px hit regions; some adjacent category centers are 20px apart. Report links are 44px tall and plate buttons have larger touch targets, so these interactions do not feel equally usable. Enlarging overlapping targets alone would not solve it.

**Fix:** add a touch-friendly app/category selection or structured score list, while retaining pointer hover and keyboard arrow navigation. Consider roving focus to avoid 55 dot stops in the Tab sequence.

Suggested work: `/adapt`, `/polish`.

### P2 — Overall scores and the interactive example compete semantically

The 82%/88% study averages and 99% interactive example are treated like comparable headline KPIs. The example shows 399 versus 404kcal; the recorded benchmark estimate was 387kcal, explained in small notes. These values are preserved from the supplied source, but their different roles are not prominent enough.

**Fix:** make the distinction between study results and the interactive illustration visible in the heading/gauge caption and near the totals. Do not alter the underlying values.

Suggested work: `/clarify`, `/typeset`.

## Design health

These are qualitative heuristic scores, not measured conversion or usability results.

| Heuristic | /4 | Finding |
| --- | ---: | --- |
| Visibility of status |3| Active nav and tooltip/focus feedback work |
| Match with real world |3| Mostly plain language; example/report distinction needs emphasis |
| User control |3| Tooltip Escape, native scrolling and FAQ work |
| Consistency and standards |2| Surface framing, title insets and density shift |
| Error prevention |3| No risky entry flows; score labels need clarity |
| Recognition over recall |3| App names/logos help; mobile hides comparison columns |
| Flexibility and efficiency |3| Arrow navigation exists;55 Tab stops remain |
| Aesthetic/minimalism |2| Nested cards, repeated scores and long mobile opening |
| Error recovery |3| Interactions are easy to leave; limited error-flow scope |
| Help and documentation |3| Methodology, formula, sources and FAQ are present |
| **Total** |**28/40**| Consistent foundations, incomplete composition |

## Cognitive load and personas

Two of eight checklist items fail: chunking (many category points and another full category table) and visual hierarchy (study average versus example accuracy). Overall cognitive load is moderate. Grouping, primary task, navigation and tooltip/FAQ disclosure work.

- **Mobile visitor:** long opening, hidden app columns and small point targets slow comparison.
- **First-time visitor:** may read 99% as the headline accuracy claim and misunderstand 399 versus 387kcal.
- **Keyboard visitor:** visible focus and arrow keys are useful; all 55 point buttons remain in the Tab order.

## Recommended order

1. `/layout`: unify section headings, alignment and surface roles.
2. `/adapt`: compact the mobile summaries and improve touch comparison.
3. `/clarify`: distinguish study averages from the example.
4. `/polish`: finish type scale, borders, labels and CTA contrast.

The user has already specified the brand palette and requested visualizations, so no further design-direction questions are needed for this review.
