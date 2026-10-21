/* Finish supplied transparent mascot exports; retain their photographic pixels.
   DIETFIT_NODE_MODULES points to a runtime containing sharp. */
const fs = require('node:fs');
const path = require('node:path');
const sharp = require(process.env.DIETFIT_NODE_MODULES ? path.join(process.env.DIETFIT_NODE_MODULES, 'sharp') : 'sharp');
const dir = path.resolve(__dirname, '../assets/brand/mascots/3d');
const poses = ['wave', 'thumbs-up', 'eating', 'exercise', 'writing', 'glasses'];
async function main() {
  for (const pose of poses) {
    const {data,info} = await sharp(path.join(dir,'cutouts',pose+'.png')).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    const {width:w,height:h} = info, count=w*h;
    // Discard detached extraction specks, retaining the main furry silhouette.
    const labels=new Int32Array(count),queue=new Int32Array(count);let label=0,biggest=0,biggestSize=0;
    for(let at=0;at<count;at++) {
      if(labels[at] || data[at*4+3]<=12) continue;
      label++;let head=0,tail=1;queue[0]=at;labels[at]=label;
      while(head<tail) {
        const p=queue[head++],x=p%w,y=Math.floor(p/w);
        for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++) {
          const nx=x+dx,ny=y+dy;if(nx<0||nx>=w||ny<0||ny>=h)continue;
          const n=ny*w+nx;if(!labels[n]&&data[n*4+3]>12){labels[n]=label;queue[tail++]=n;}
        }
      }
      if(tail>biggestSize){biggestSize=tail;biggest=label;}
    }
    if(biggestSize<count*.1)throw new Error('Missing mascot silhouette: '+pose);
    let left=w,top=h,right=0,bottom=0;
    for(let at=0;at<count;at++){
      if(labels[at]!==biggest){data[at*4+3]=0;continue;}
      const x=at%w,y=Math.floor(at/w);left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);
    }
    const body=await sharp(data,{raw:{width:w,height:h,channels:4}}).extract({left,top,width:right-left+1,height:bottom-top+1}).resize(900,900,{fit:'inside'}).png().toBuffer({resolveWithObject:true});
    const image=await sharp({create:{width:1000,height:1000,channels:4,background:'#00000000'}}).composite([{input:body.data,left:Math.round((1000-body.info.width)/2),top:950-body.info.height}]).png().toBuffer();
    await sharp(image).webp({quality:88,alphaQuality:100}).toFile(path.join(dir,pose+'.webp'));
    console.log(pose+': transparent, fitted to shared 1000px canvas, feet at y950');
  }
  // Product UI uses a face crop rather than an unreadable miniature full body.
  await sharp(path.join(dir,'glasses.webp')).extract({left:235,top:40,width:530,height:530}).resize(160,160).webp({quality:88,alphaQuality:100}).toFile(path.join(dir,'glasses-avatar.webp'));
}
main().catch(error=>{console.error(error);process.exitCode=1;});
