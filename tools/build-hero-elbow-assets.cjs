/* Extract native proximal-arm pixels for the local UV repair. No generated pixels. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const deps=process.env.DIETFIT_NODE_MODULES,sharp=require(deps?path.join(deps,'sharp'):'sharp');
const root=path.resolve(__dirname,'..'),dir=path.join(root,'assets/hero/us-en');
function readVar(b,p){let n=0,s=0,v;do{v=b[p++];n|=(v&127)<<s;s+=7}while(v&128);return [n,p]}
function embedded(file,name){const b=fs.readFileSync(file),marker=Buffer.concat([Buffer.from([0,105,203,1,name.length]),Buffer.from(name)]),at=b.indexOf(marker);if(at<0)throw Error('Missing native image '+name);const c=b.indexOf(Buffer.from([0,106,212,1]),at+marker.length);if(c<0||c>at+150)throw Error('Unexpected asset layout');const[n,p]=readVar(b,c+4);return b.subarray(p,p+n)}
(async()=>{
 const vi=embedded(path.join(root,'assets/hero/dietfit-hero.riv'),'hands');
 const bg=embedded(path.join(root,'assets/hero/dietfit-hero.riv'),'bg');
 await sharp(vi).webp({lossless:true}).toFile(path.join(dir,'hands-native-vi.webp'));
 await sharp(bg).webp({lossless:true}).toFile(path.join(dir,'elbow-bg-vi.webp'));
 const size=await sharp(bg).metadata(),handSize=await sharp(vi).metadata();
 const report={method:'Lossless native source pixels only. No image generation, outpainting, texture extension or edited Rive asset. EN uses its original hands.webp. The VI hand texture is extracted losslessly from the original Rive file.',en:{source:'hands.webp',uv:[64,0,416,162]},vi:{source:'dietfit-hero.riv / hands',asset:'hands-native-vi.webp',dimensions:[handSize.width,handSize.height],uv:[128,30,416,132],sourceSha256:crypto.createHash('sha256').update(vi).digest('hex')},backgroundVI:{source:'dietfit-hero.riv / bg',dimensions:[size.width,size.height],sourceSha256:crypto.createHash('sha256').update(bg).digest('hex')}};
 fs.writeFileSync(path.join(dir,'elbow-uv.json'),JSON.stringify(report,null,2)+'\n');console.log(report);
})().catch(e=>{console.error(e);process.exitCode=1});
