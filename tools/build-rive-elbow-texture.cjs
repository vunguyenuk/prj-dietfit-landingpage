/* Repair the proximal cap without changing the hand, meal, scale or motion.
   The native bone pivot lies inside this small rounded cap. A straight image
   edge previously rotated into view as a pointed skin fragment. */
const fs=require('node:fs'),path=require('node:path');
const deps=process.env.DIETFIT_NODE_MODULES;
const dep=name=>require(deps?path.join(deps,name):name);
const {createCanvas,loadImage}=dep('@napi-rs/canvas'),sharp=dep('sharp');
const root=path.resolve(__dirname,'..'),dir=path.join(root,'assets/hero/us-en');
(async()=>{
  const source=await loadImage(path.join(dir,'hands.webp'));
  const canvas=createCanvas(1536,1055),c=canvas.getContext('2d');
  c.beginPath();c.moveTo(0,160);c.lineTo(80,160);
  c.ellipse(300,160,220,160,0,Math.PI,Math.PI*2);
  c.lineTo(1536,160);c.lineTo(1536,1055);c.lineTo(0,1055);c.closePath();c.clip();
  c.drawImage(source,0,0);
  await sharp(canvas.toBuffer('image/png')).webp({lossless:true}).toFile(path.join(dir,'hands-elbow-repair.webp'));
  fs.writeFileSync(path.join(dir,'elbow-repair.json'),JSON.stringify({
    source:'hands.webp',output:'hands-elbow-repair.webp',dimensions:[1536,1055],
    operation:'Round only the upper 160px cap with an elliptical clip, center300/160, radii220/160. Original texture, alpha and RGB at y>=161 are retained. No generated photograph is used.',
    preserved:'The complete hand, fingers, bowl, food, shadows, original image placement, Rive transform records and every timeline/state-machine byte.',
    playback:'Restore from native frame0, including the original 43–90 desktop arm rotation. Remove the scroll-linked foreground fade.'
  },null,2)+'\n');
  console.log('Built local elbow-cap repair; original hand/meal texture remains unchanged below y160.');
})().catch(e=>{console.error(e);process.exitCode=1});
