/* Conservative resampling and unsharp masking only. No generative processing. */
const sharp = require('sharp');
const path = require('path');
const root = path.resolve(__dirname, '..');
async function prepare(input, name) {
  const source = path.join(root, input);
  const meta = await sharp(source).metadata();
  for (const scale of [1, 2]) {
    await sharp(source)
      .resize({width: meta.width * scale, kernel: 'lanczos3'})
      .sharpen({sigma: .65, m1: .5, m2: 1.4, x1: 2, y2: 5, y3: 5})
      .webp({quality: 96, effort: 6, smartSubsample: true})
      .toFile(path.join(root, `assets/about-photos/${name}${scale === 2 ? '@2x' : ''}.webp`));
  }
}
(async () => {
  await prepare('assets/about-figma/office-lunch.webp', 'office-lunch-crisp');
  await prepare('assets/about-photos/dinner-shelf-original.png', 'dinner-shelf-crisp');
})();
