/* Restore original photographic pixels over imagegen background extensions.
   Usage: DIETFIT_NODE_MODULES=/absolute/node_modules node tools/build-card-headroom.cjs health.png progress.png
   Only the extension and the outer non-face seam may use generated pixels. */
const path = require('node:path');
const fs = require('node:fs/promises');
const sharp = require(path.join(process.env.DIETFIT_NODE_MODULES || '', 'sharp'));
const root = path.resolve(__dirname, '..');
const asset = name => path.join(root, 'assets/cards/figma-sync', name);

async function build(healthBackground, progressBackground) {
  const health = await sharp(asset('card-5.webp')).resize(975,1365).ensureAlpha().raw().toBuffer();
  for (let y=0; y<1365; y++) for (let x=0; x<975; x++) {
    // This rectangle includes the full original face, expression and headphones.
    const protectedFace = x>=350 && x<920 && y<560;
    const distance = Math.min(x-2,972-x,y,1365-y);
    health[(y*975+x)*4+3] = protectedFace ? 255 : Math.round(255*Math.max(0,Math.min(1,distance/24)));
  }
  await sharp(healthBackground).resize(1500,2100,{fit:'fill'})
    .composite([{input:health,raw:{width:975,height:1365,channels:4},left:262,top:735}])
    .webp({lossless:true,effort:6}).toFile(asset('card-5-headroom.webp'));

  const progress = await sharp(asset('card-6.webp')).extract({left:0,top:0,width:1500,height:1500}).ensureAlpha().raw().toBuffer();
  // Only pavement / the very top of the hair is feathered. The original phone,
  // hand and visible face begin below this 60px seam and stay fully opaque.
  for (let y=0; y<60; y++) for (let x=0; x<1500; x++) progress[(y*1500+x)*4+3] = Math.round(255*y/60);
  await sharp(progressBackground).resize(1500,2100,{fit:'fill'})
    .composite([{input:progress,raw:{width:1500,height:1500,channels:4},left:0,top:600}])
    .webp({lossless:true,effort:6}).toFile(asset('card-6-headroom.webp'));

  // Verify every face pixel against the original, resized only for composition.
  const originalFace = await sharp(asset('card-5.webp')).resize(975,1365)
    .extract({left:350,top:0,width:570,height:560}).removeAlpha().raw().toBuffer();
  const finalFace = await sharp(asset('card-5-headroom.webp'))
    .extract({left:612,top:735,width:570,height:560}).removeAlpha().raw().toBuffer();
  if (!originalFace.equals(finalFace)) throw new Error('Original face pixels changed');
  const originalProgress = await sharp(asset('card-6.webp'))
    .extract({left:0,top:60,width:1500,height:1440}).removeAlpha().raw().toBuffer();
  const finalProgress = await sharp(asset('card-6-headroom.webp'))
    .extract({left:0,top:660,width:1500,height:1440}).removeAlpha().raw().toBuffer();
  if (!originalProgress.equals(finalProgress)) throw new Error('Original person or phone pixels changed');
  console.log('PASS: original face pixels, person and phone preserved; background seams blended.');
}

const [healthBackground,progressBackground] = process.argv.slice(2);
if (!healthBackground || !progressBackground) throw new Error('Provide both generated background PNG paths');
Promise.all([fs.access(healthBackground),fs.access(progressBackground)])
  .then(()=>build(healthBackground,progressBackground)).catch(error=>{console.error(error);process.exitCode=1;});
