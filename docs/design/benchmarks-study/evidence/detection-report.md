# Independent detector and live DOM assessment

Scope: research only. Measured the live `/en/benchmarks/` page in fresh Chromium tabs titled `[Human]` at 1440×900, 390×844 and 320×740. No production files, packages or dependencies changed. These are deterministic measurements and expert interpretations, not user-test findings. No design score was invented.

## Main result

The page delays the evidence a benchmark visitor came for and shrinks its most useful interactive content on phones. It is technically responsive: no page-wide horizontal overflow was found, and the horizontally scrolling table has working keyboard access, a sticky category column and a mobile hint. Its weaknesses are hierarchy, proof density, small interactive labels and unclear distinctions between example/demo and measured claims.

| Measurement | Desktop 1440 | Mobile 390 | Mobile 320 |
| --- | ---: | ---: | ---: |
| Page height | 5623px | 7049px | 7489px |
| Hero visual begins | 560px | 562px | 586px |
| Hero visual height | 560px | 420px | 420px |
| Hero score badge begins | 941px | 846px | 870px |
| Photo section heading begins | 1346px | 1205px | 1229px |
| Photo ranking heading begins | 1462px | 1826px | 1848px |
| Text ranking heading begins | 2692px | 3226px | 3415px |
| Category table begins | 2685px | 3686px | 3875px |
| Methodology heading begins | 3664px | 4619px | 4807px |
| H1 font size | 83.52px | 44px | 44px |
| Food chip font size | 12px | 10px | 10px |
| Food chip height | 23px | 21.5px | 21.5px |

The first viewport contains a product-benefit headline, explanatory copy with 82.0%, a See the results link, and the upper portion of a phone illustration. It contains no comparative ranking. Even the separate 82.0% / #1 badge starts below the first viewport at each measured size. At 390px, a reader scrolls over two viewport heights to reach the Photo accuracy ranking; at 320px, roughly two and a half.

The 1440px hero allocates 1280×560px to photography while the actual centered phone wrapper is only 232px wide before rotation (roughly 18% of the stage width; rotated bounds 272×491px). On mobile the wrapper is 175px before rotation, with rotated bounds 205×371px. That scale makes an image of a tiny app screen the visual centerpiece, while the comparative evidence sits much farther down.

## Deterministic detector

The exact `npx --no-install impeccable --json en/benchmarks/index.html` command declined because npx sought 4.8.0, which is not cached. The cached 4.6.0 binary ran successfully with exit code 2 and produced 15 findings at line 0 (no precise source locations):

- 3 low-contrast: orange text #fe692e on near white (~2.86:1), muted #64705f on lime #e4efcf (~4.36:1; advisory), gray #a0a09c on table cream #fbfcf7 (~2.55:1).
- 1 tiny-text: 11.2px body text.
- 10 cramped-padding flags on the min-w-0 wrapper, ruled methodology items, formula wrapper, FAQ details and footer wrappers.
- 1 cream-palette flag.

Raw JSON: `detection-cli-cached.json`. Standard npx failure: `detection-cli.stderr`.

### Confirmed versus contextual/false positives

- Confirmed: the orange calorie values inside food chips are 12px desktop / 10px mobile. Near-white chip surfaces give about 2.86:1 contrast. Their small size makes this a concrete reading problem.
- Confirmed: the mobile kicker is 11.2px; #1 badge is 11px; four actionable food-chip labels are 10px. The CLI only reported one tiny-text instance, so mobile live measurements add material findings.
- Contextual: cream palette is an explicit direction in `.impeccable.md`, so this detector flag is not evidence that the chosen color is wrong.
- Contextual/mostly false positives: method list items have intentional top rules and 32px vertical padding (28px mobile), and FAQ summaries have at least 88px height with 24px block padding. A full-width footer and open ruled layout do not inherently need card-like padding. The generic cramped-padding list should not become a recommendation to wrap everything in cards. Some source locations cannot be precisely tied to an element because scanner emits line 0. Gray contrast warning is confirmed on the category sample-count spans (`text-dietfit-blog-ink/40`), rather than the table percentage data.
- Contrast advisory on lime is borderline (4.36:1). Prioritize orange 10px labels and gray category sample counts first.

Optional live overlay skipped: installed CLI's `live` command is a newer project-config/variant workflow, requiring `.impeccable/live/config.json` and script injection in source. That differs from the skill's simple detect.js server. No server was started, no overlays were injected, and there is no live-console detector output to claim. All live DOM measurement tabs were closed.

## Priority findings

1. **Evidence comes late (P1).** A research/report URL opens as a marketing landing page. The hero, large food scene, trust labels, another centered section heading and an interactive specimen precede the actual comparative ranking, especially after columns stack on mobile. Show photo/text results close to the report title and let readers move from outcome to supporting specimen and method.
2. **The useful interactive labels are too small (P1).** Mobile food chips are 10px high-density labels inside 21.5px buttons. Keeping the annotation on the photograph at all widths sacrifices reading and touch accuracy. A selected-food list or readable panel beneath the photo could preserve every interaction without shrinking labels.
3. **Numbers need clearer scopes (P2).** The selected specimen says weighed 404kcal, DietFit 399kcal and 99% accurate, while a caption says its benchmark run was 387kcal. These can be different runs, but a reader has to reconcile them. The 644 weighed plates and foods badge is unexplained beside n=30 photos and n=107 text foods (137 combined). Do not label it wrong without source clarification; label which set it counts. The prominent #1 text claim is based on 88.0% versus 87.7% in one run, with no variability displayed. This merits restrained wording and visible scope, not invented uncertainty estimates.
4. **Keyboard focus has regressions despite generally working controls (P2).** Tab testing shows See the results has a 3px outline whose color is the same cream as the surrounding page (#f7f7ef), making the ring effectively 1:1 against that canvas. Download Dietfit has `outline-style:none` and only fully transparent box shadows when focused; no visible keyboard indicator was found on that CTA. The table, FAQ summaries and food buttons have outlines; do not report a global missing-focus issue.
5. **Source transparency requires more navigation (P2).** Main methodology uses plain citation text rather than visible source links; the FAQ promises public records. Verify source links and show direct supporting evidence where the claims occur. The older content/benchmark-protocol.md refers to a prior unpublished framework; do not treat that stale document as proof the imported report data is fabricated.

## Working implementation and nonissues

- No page-wide horizontal overflow at 1440,390 or320px: document width exactly matched viewport width.
- Table is contained and horizontally scrollable: 620px table inside 340px available mobile width at390 and270px at320. It has tabindex0, role region and accessible label Food category accuracy comparison.
- Category cells are sticky. ArrowRight on focused mobile table changes scrollLeft from0 to40px while the first header cell remains x25px. Focus outline is orange3px. A mobile Swipe to compare all apps hint is present.
- Skip link becomes visible on keyboard focus; tab order reaches navigation, report CTA, food chips, table, FAQ and footer.
- No browser-console errors in initial measurement passes.
- Main body/secondary type colors largely pass the numerical check: #647061 on cream ~4.84:1; text intro #5b7176 on sky ~4.52:1; table gray #64705f on cream ~5.06:1. There is no basis for saying all gray copy lacks contrast.

Raw live measurements and keyboard traversal: `detection-dom.json`. Follow-up interaction evidence: `detection-followup.json`. See the results actually jumps to its anchored comparison with 112px top clearance; the mobile ranking still sits below the large specimen because the photo and ranking stack. Mobile menu opens with About, Blog, Benchmarks and Get the app, and toggles closed. The first FAQ expands. Food chips activate from keyboard and reveal ingredient comparison details. Scripts are in this temporary folder only.
