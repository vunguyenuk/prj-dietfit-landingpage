# US accuracy section — draft benchmark protocol

Requested replacement for the EN-only Vietnamese influencer video block, 21 October 2026. The VI block remains unchanged. Reference: https://0xcal.app/ and https://0xcal.app/benchmarks (reviewed 21 October 2026).

## Current evidence state

No Dietfit benchmark dataset or measured app results were supplied or found in this repository. The section is an explicitly unpublished framework, with no percentages, competitor rankings, sample counts, test date, fabricated food results, or claim that testing has already happened. All dash cells mean not published, not zero error.

0xCal's numbers belong to 0xCal and must never be relabeled as Dietfit results. Its text-description benchmark and weighed-plate photo test are separate experiments. Its blended headline is not a suitable Dietfit photo accuracy claim.

## Proposed protocol (requires actual testing)

1. Create a held-out set of US packaged foods, single-ingredient foods, mixed home-cooked meals and restaurant meals with a verifiable reference. Exclude restaurant cases without a weighed recipe or matching published serving reference from scored results. Retain reasons for exclusions.
2. Record reference provenance: nutrition label/serving, weighed ingredients and cooking yield, or exact nutrition database records. Include oils, sauces and edible portions. A recipe name alone is not ground truth.
3. Evaluate Quick Scan and Deep Scan separately. Keep photo and text input tests separate. Record the unedited first estimate; report user-corrected results separately.
4. For any competitor comparison, use the same image or text input, serving information and correction policy. Record app/model versions and test date. Do not compare Dietfit photos with another app's unrelated database search result and call it equivalent.
5. Record reference kcal, predicted kcal and absolute kcal error per attempt. For positive reference kcal, percentage error is `100 * abs(predicted_kcal - reference_kcal) / reference_kcal`. Report median absolute percentage error (lower is better), mean absolute kcal error, completed/attempted coverage, sample counts and exclusions. A failed scan is a failed attempt, not a zero-error result.
6. Repeat scans to characterize variation rather than cherry-picking the best run. Publish per-meal records, reference sources, attempt counts, failures and aggregate calculations together.

## Data needed to replace the unpublished state

Use `content/benchmark-template.csv` for actual measurements. Only publish measured results with a named dataset, input type, app/version, test date, reference records and calculation verification. Category aggregates must link to their per-meal records. Do not label internal tests independent or clinically validated.

## Implementation boundary

`#dietfit-benchmark` replaces only the EN creator block. `styles/dietfit-benchmark-en.css` uses the existing Dietfit typography/palette. Native details/summary exposes the proposed method with no JavaScript dependency or video requests. This is a local review draft; no deployment is part of this change.

The compact `#dietfit-score-strip` sits between the EN Rive hero and feature carousel, following the user's 0xCal layout reference. It reserves three comparable metric columns for Dietfit, MyFitnessPal and Fitatu. All scores remain unpublished placeholders; these app names identify proposed comparison columns, not a completed experiment or ranking. The planned metric is median calorie percentage error (lower is better), consistent with the detailed section. Do not populate it with 0xCal's reported accuracy percentages: those are a different measure and dataset.
