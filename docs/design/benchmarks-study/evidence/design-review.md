# Dietfit benchmark: independent LLM design review

Inspected live at `http://127.0.0.1:4180/en/benchmarks/` on 28 Oct 2026 in fresh Playwright desktop (1440×1000) and mobile (390×844) tabs titled `[LLM] …`. Reviewed `.impeccable.md`, benchmark HTML/CSS, and critique heuristic/cognitive-load/persona references. Tested ingredient disclosure and FAQ. This report contains no production changes. It is an independent visual assessment; detector findings belong to the separate assessment.

## Verdict

**Yes, I would believe this was AI-assisted.** It avoids the loudest clichés (no gradient text, neon glow, glass UI, endless icon cards), but still resembles a collection of fashionable treatments: giant tightly tracked headline, cream canvas, generic abundant-food still life, a rotated phone, floating metric tile, sky-blue section and lime winner cards. The treatments are competent individually; the editorial idea connecting them is weak.

**Judgment:** The page is not broken or uniformly ugly. It is readable, and the lower report has a sound foundation. Its main aesthetic weakness is art direction and hierarchy: the largest visual is decorative, the strongest evidence is visually subordinate, and Dietfit's warm, energetic identity becomes quiet green wellness branding. Changing Be Vietnam Pro would not address this.

## Observed facts versus interpretation

- **Observed:** Desktop hero image is 1280×560; phone container is 232px wide (~18% of the image width), rotated −5°. The image is largely carrots, herbs, lemons and an empty tabletop. Phone footage includes “AI is recognizing your meal” and “Still on it, hang tight…” states. **Interpretation:** It advertises produce and an unfinished scan more strongly than accurate results. Tiny changing UI is difficult to read and weak as the visual proof of a benchmark.
- **Observed:** Desktop headline is 83.52px, line-height .99, letter-spacing −.065em, while supporting copy is 17px in a separate bottom-aligned column. The h2 for photo evidence begins at y≈1346. On mobile the photo ranking begins at y≈1826. **Interpretation:** A reader travels a long way before encountering the comparison they came for; the empty upper-right hero area and large scenic stage feel disproportionate to the short report claim.
- **Observed:** Orange is prominent in the logo and ingredient outlines, but main text/actions are dark green, result highlights are lime, and data surfaces are pale blue. **Interpretation:** This is calm and coherent at a basic level but too muted and generic for the stated energetic Gen Z brand. It feels closer to an organic-food brand than Dietfit's main product page.
- **Observed:** The interactive example shows 404 weighed kcal, 399 current-demo kcal and “In the benchmark run … 387 kcal.” The hero mentions 30 plates, the trust line 644 plates/foods, and text results 107 foods. **Interpretation:** These can have valid distinct meanings, but their scopes are not explained where first encountered. Reading and reconciling them adds more work than the visual simplicity suggests.
- **Observed:** No page-wide horizontal overflow at 1440 or 390. Mobile table has role=region, tabindex=0, an accessible label, a sticky category column and a visible swipe hint. **Interpretation:** Responsive implementation is substantially better than the art direction.

## What works

1. **Real evidence is present.** The actual plate, per-food comparisons, kcal error, category table, one-run rule and formula can support a credible report. Keeping the unglamorous dataset plate is more trustworthy than replacing it with a prettier invented result.
2. **Readable lower-page structure.** Open ruled methodology/FAQ, clear heading sizes, tabular numerals and restrained borders are preferable to boxing every paragraph.
3. **Interaction has a useful purpose.** Four food labels reveal weighed versus estimated details. FAQ disclosure works. Mobile table overflow is intentionally handled rather than clipping data silently.

## Priority issues

### P1 — The hero's visual claim is weaker than its written claim

**Evidence:** `desktop-hero-settled.png`, `mobile-top.png`; 232px phone over a 1280px food background, readable loading states instead of a clear result. Photo accuracy lives in a separate floating card.

**Why:** First impression says “food app” but gives little distinct evidence for “accuracy report.” Large photos alone do not reproduce the reference's confident art direction.

**Fix:** Build one evidence-led hero: clear report title and concise scope, one large legible actual Dietfit result paired with its weighed reference, and a short results/methodology navigation. If the scenic photo remains, compose it specifically around a much larger product view with fewer props. Prefer a stable completed result to a perpetual scan at the pivotal moment. Preserve the original demo elsewhere. Suggested focus: `/layout`, `/distill`.

### P1 — The results lack a fast, trustworthy overview

**Evidence:** Desktop photo comparison title at y≈1346; mobile ranking title at y≈1826. Photo and text scores are spread across body copy, floating tile and two rankings. Dataset attribution appears at the bottom of the hero and later in methodology.

**Why:** A benchmark reader should immediately understand what was tested, the result, against whom, and where to verify it. The current sequence spends more attention on scenic staging than those questions.

**Fix:** Near the report title, show two clearly labelled result statements (photo: 82.0%, 30 plates; text: 88.0%, 107 descriptions), plus a short “How we tested” link. Keep average kcal error alongside photo accuracy. Make the sample relationship to the wider 644-item dataset explicit. Distinguish “illustrative/current demo” from “recorded benchmark run” beside 399/387 without changing either number. Keep all detailed rankings, examples, categories and methodology. Suggested focus: `/clarify`, `/layout`.

### P2 — The page borrows a palette without expressing Dietfit

**Evidence:** Cream, sage ink, lime winners, sky-blue data; orange largely restricted to logo, tiny eyebrow dot, labels/outlines. Same food image is reused under a dark green scrim for the closing CTA.

**Why:** The page's emotional tone is calm, polished wellness. The brief asks for warm encouragement and energy. Reusing the grocery scene at the end produces a repeated advertising motif rather than a more confident final proof or product payoff.

**Fix:** Keep cream and Be Vietnam Pro. Give orange a deliberate role in one or two high-value places (primary action/result annotation), retain neutral tables, and reserve lime for rank meaning. Use authentic product results as the memorable image. If a lifestyle image is added, use a real Dietfit user/meal context outside the dataset evidence. Avoid pretending the research dataset is Vietnamese. Suggested focus: `/colorize`, `/polish`.

### P2 — Mobile preserves all sections but does not sufficiently edit the journey

**Evidence:** 7k-ish pixel page; three explanation steps take almost an entire screen (`mobile-3.png`). Ingredient labels are 10px text with ~21.5px-high click areas. In the 340px table viewport, category plus Dietfit column consume almost all the width; other apps require horizontal scrolling (`mobile-table.png`).

**Why:** Casey must read and scroll extensively before making the app decision. The useful interactive labels look more like tiny annotations than comfortable controls; comparisons require repeated panning.

**Fix:** Keep all data while making the first pass shorter: concise summary before the photo, put secondary explanation in an accessible optional detail area, provide a separate ≥44px-high ingredient list/selector below the photo, and offer a compact overview of competitor scores before the full table. Keep the existing scroll hint, sticky category, full table and keyboard access. Suggested focus: `/adapt`, `/distill`.

### P2 — Detailed credibility cues are visually and functionally secondary

**Evidence:** Methodology source names/URLs appear as small body text; “Can I check these numbers myself?” says the datasets are public without providing an actionable source link in the inspected answer.

**Why:** A self-published #1 comparison benefits from inviting scrutiny. A quiet source paragraph makes the report feel more promotional even when the methodology text is careful.

**Fix:** Add conspicuous source links and test scope/date next to the summary and methodology, without exaggerating third-party endorsement. Include the provided formula and all caveats. Make the raw/source data path obvious if available; do not invent a downloadable run artifact. Suggested focus: `/clarify`, `/polish`.

## Nielsen heuristic scores

Scale: 0 poor–4 excellent. These are usability scores, not a beauty score. No checkout, submission or destructive operation is present; error recovery cannot be meaningfully rated. Total is **23/36 applicable points** (~25.6/40 normalized, “acceptable” band); do not report the untested heuristic as a perfect score.

| # | Heuristic | Score | Rationale |
|---|---|---:|---|
| 1 | Visibility of system status | 3 | Active Benchmarks nav, ingredient expansion and FAQ state exist. Animated score can briefly show intermediate values (a mobile capture showed 74%, later settled at 82%); factual score would be clearer without counting through false transient values. |
| 2 | Match with real world | 3 | Plain kcal, scale and plate terminology. “Weigh each one” actually describes estimating grams; real weighing and app estimation should be distinguished. |
| 3 | User control/freedom | 3 | Normal links, local disclosures, no forced modal or captive flow. Detailed recovery/undo is inapplicable to this read-only report. |
| 4 | Consistency/standards | 3 | Navigation, typography, ranking and table conventions are coherent. DietFit/Dietfit capitalization and app-store destination region vary; visual brand connection is weaker than local consistency. |
| 5 | Error prevention | 2 | No risky input (destructive/form safeguards N/A). For interpretation, 399/387/404 and 30/107/644 scopes need proactive labels to prevent incorrect comparisons. |
| 6 | Recognition over recall | 3 | Ingredient names and scores visible; details disclosed locally. Mobile comparison still asks reader to retain values while panning across app columns. |
| 7 | Flexibility/efficiency | 2 | Results jump and focusable table help; no local report outline or direct route to text/method/source sections from the opening. Report-specific shortcuts matter more than invented app-style keyboard commands. |
| 8 | Aesthetic/minimalist | 2 | Readable sections, few decorative components. Oversized scenic hero, loading-state phone and repeated full-width photography do not earn their dominance. |
| 9 | Error recognition/recovery | N/A | No user input or recoverable error state exercised. Do not infer good error handling from absence of errors. |
| 10 | Help/documentation | 2 | FAQ and formula provide useful explanation. Source references need direct actionable links at the point a skeptical reader wants verification. |

## Cognitive load checklist

**3/8 failures: moderate extraneous load.** This is not a wall of arbitrary options; the problem is the reading path and reconciliation of evidence.

| Item | Result | Evidence |
|---|---|---|
| Single focus | Fail | Scenic product marketing and accuracy-report proof compete for dominance in the hero. |
| Chunking | Pass | 3 photo ranks, 4 text ranks, 3 explanation steps, 3 method rules, 3 FAQ questions. 13 category rows are a structured dataset, not 13 navigation choices. |
| Grouping | Pass | Image/example, rankings, blue text data and ruled methodology are clearly grouped. |
| Visual hierarchy | Fail | Largest visual is produce; key comparative evidence begins well below it. |
| One thing at a time | Pass | Reading sequence is linear; ingredient disclosures are local and optional. |
| Minimal choices | Pass | Opening has 2 CTAs; desktop has 4 top-level links; 4 food controls; each FAQ row is one decision. No observed primary decision point exceeds 4 choices. |
| Working memory | Fail | Demo versus run values and test-population counts require reconciliation; mobile table requires keeping values in memory while panning. |
| Progressive disclosure | Pass with caveat | Ingredient detail and FAQ work. Secondary process explanation and the long table are fully expanded by default and could be optional after a trustworthy summary. |

## Relevant persona red flags

- **Jordan, first-time tracker:** The headline describes a capability but does not quickly explain what “82.0% accuracy” means. “Weigh each one” may imply the app measures weight. Three different kcal values in the interactive example need a visible explanation of current demo versus recorded run.
- **Riley, skeptical evaluator:** “#1” is prominent while datasets, sample relationships and verification links are secondary. The 0.3-point text lead and narrow 30-plate photo comparison should retain their exact scope; do not enlarge the claim during redesign.
- **Casey, distracted mobile reader:** Ranking appears ~1826px down, 10px labels have short hit areas, and the full table is 620px wide inside 340px. A good swipe hint exists, but a compact comparison overview would reduce panning and memory work.
- **Mai, Vietnamese young adult exploring a less restrictive tracker (project context):** Abundant raw produce and restrained sage/lime branding have little cultural or personal specificity. Nothing is offensively restrictive, but this page does not express much encouragement or energy. Preserve real research imagery; bring brand warmth through copy, framing and authentic non-evidence imagery instead of fabricating local research examples.

## Emotional journey and minor observations

The opening evokes calm organic-food advertising, the middle shifts to careful technical reading, and the end returns to the same food advertisement. The positive peak should instead be “I can see how this estimate compares with a real weighed meal.” There are no payment/deletion anxiety valleys. The lower methodology is the most confident and credible part of the page; use its clarity as the organizing principle for the opening.

Very tight headline tracking is a polish opportunity, not the root cause. A stable 82.0% is preferable to a count-up on a research claim. Ingredient popover expands successfully and exposes `aria-expanded`; its mobile surface overlays other labels and summary values, which is acceptable temporarily but should have an obvious close/toggle pattern. No full accessibility or performance certification is implied.

## Recommended design direction

**A Dietfit field report with a product demonstration.** Keep Be Vietnam Pro, cream, authentic UI, exact figures and complete data. Use one confident opening spread with the report question, two plainly labelled findings and one large legible proof image. Follow with photo evidence, text evidence, full category table, methodology, FAQ and a restrained product CTA. Add a compact section outline and explicit source access. Use orange to identify meaningful actions, lime only for rank, and generous whitespace around actual evidence rather than around scenic decoration. References should guide scale, confidence and composition; their decorative objects should not be copied literally.

The useful question for the next design pass is: **What should a skeptical visitor understand after five seconds, and which single image actually proves that?**

## Evidence artifacts

- `desktop-top.png`, `desktop-hero-settled.png`, `desktop-full.png`
- `desktop-1.png` through `desktop-4.png`
- `mobile-top.png`, `mobile-hero-settled.png`, `mobile-full.png`
- `mobile-1.png` through `mobile-6.png`
- `desktop-food-selected.png`, `mobile-food-selected.png`
- `desktop-table.png`, `mobile-table.png`, `desktop-faq.png`, `mobile-faq.png`
- `page-observations.json`, `interaction-observations.json`
