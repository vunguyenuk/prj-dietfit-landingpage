# Calorie tracker app icons

Downloaded 2026-10-28 for the app comparison chart, from official developer-provided artwork:

- Cal AI: [Apple App Store listing](https://apps.apple.com/us/app/cal-ai-calorie-tracker/id6480417616), artwork returned by Apple's `itunes.apple.com/lookup?id=6480417616` metadata endpoint.
- MyFitnessPal: [Apple App Store listing](https://apps.apple.com/us/app/myfitnesspal-calorie-counter/id341232718), artwork returned by the same lookup endpoint.
- Fitatu: [Apple App Store listing](https://apps.apple.com/us/app/fitatu-ai-calorie-counter/id1011095795), artwork returned by the same lookup endpoint.
- 0xCal: [official site icon](https://0xcal.app/icon.png), referenced by the site's icon and apple-touch-icon tags.
- Dietfit reuses the existing local app icon.

Charts use `content/benchmark-chart-data.json`, a snapshot of the supplied report, with no live API replacement. Photo dots represent each app's overall mean; text dots represent the 13 categories in the detailed table. Y encodes the exact score; horizontal jitter separates overlapping values without changing them.
