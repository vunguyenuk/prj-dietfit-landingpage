/* Local proximal-arm UV repair. The original Rive file, rotation keyframes,
   hand, meal and scroll mapping remain untouched. Only the cropped upper band
   is constrained beyond the viewport edge, instead of showing its cut cap. */
(function () {
  'use strict';
  window.createDietfitHeroElbow = function (hero,stage,nativeCanvas) {
    if(!document.body.matches('.dietfit-home--en,.dietfit-home--vi'))return null;
    const vi=document.body.classList.contains('dietfit-home--vi');
    const compact=window.matchMedia('(max-width:1024px)');
    const shell=document.createElement('div');shell.className='df-hero-native-window'+(vi?'':' df-hero-native-window--en');
    nativeCanvas.before(shell);shell.append(nativeCanvas);
    const canvas=document.createElement('canvas');canvas.className='df-hero-elbow';canvas.setAttribute('aria-hidden','true');shell.append(canvas);
    const ctx=canvas.getContext('2d');if(!ctx)return null;
    const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');
    svg.setAttribute('width','0');svg.setAttribute('height','0');svg.setAttribute('aria-hidden','true');
    const defs=document.createElementNS(ns,'defs'),clip=document.createElementNS(ns,'clipPath'),path=document.createElementNS(ns,'path');
    clip.id='df-hero-elbow-cutout';clip.setAttribute('clipPathUnits','userSpaceOnUse');
    path.setAttribute('clip-rule','evenodd');path.setAttribute('fill-rule','evenodd');
    clip.append(path);defs.append(clip);svg.append(defs);shell.append(svg);
    const image=new Image(),background=vi?new Image():null;let loaded=0,ready=false,last=-1,geometry,painted=false;
    const clamp=n=>Math.max(0,Math.min(1,n));
    function cubic(t,a,b){const q=1-t;return 3*q*q*t*a+3*q*t*t*b+t*t*t}
    function ease(t,small){let lo=0,hi=1;for(let i=0;i<22;i++){const mid=(lo+hi)/2;if(cubic(mid,small?.2199999988079071:.8500000238418579,.36000001430511475)<t)lo=mid;else hi=mid}return cubic((lo+hi)/2,small?1:0,1)}
    function resize(){
      const box=stage.getBoundingClientRect(),ratio=window.devicePixelRatio||1;
      const fit=vi?Math.max(box.width/1920,box.height/1258):Math.max(1,Math.min(box.height,(box.width-32)*1258/700))/1258;
      const left=Math.max(0,Math.floor(box.width/2+(-200-960)*fit));
      const right=Math.min(box.width,Math.ceil(box.width/2+(650-960)*fit));
      const bottom=Math.max(1,Math.min(box.height,Math.ceil(box.height/2+(260-629)*fit)));
      geometry={width:box.width,height:box.height,ratio,fit,left};
      const width=Math.max(1,right-left);
      canvas.style.left=left+'px';canvas.style.width=width+'px';canvas.style.height=bottom+'px';
      canvas.width=Math.ceil(width*ratio);canvas.height=Math.ceil(bottom*ratio);painted=false;
      const previous=last;last=-1;if(previous>=0)render(previous);
    }
    function clear(){ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,canvas.width,canvas.height);nativeCanvas.style.clipPath='';painted=false}
    function triangle(a,b,c,p,q,r){
      const det=a.x*(b.y-c.y)+b.x*(c.y-a.y)+c.x*(a.y-b.y);if(Math.abs(det)<1e-8)return;
      const affine=(u,v,w)=>[(u*(b.y-c.y)+v*(c.y-a.y)+w*(a.y-b.y))/det,(u*(c.x-b.x)+v*(a.x-c.x)+w*(b.x-a.x))/det,(u*(b.x*c.y-c.x*b.y)+v*(c.x*a.y-a.x*c.y)+w*(a.x*b.y-b.x*a.y))/det];
      const X=affine(p.x,q.x,r.x),Y=affine(p.y,q.y,r.y);
      ctx.save();ctx.beginPath();
      // A tiny overlap removes the internal diagonal's antialias seam.
      const center={x:(p.x+q.x+r.x)/3,y:(p.y+q.y+r.y)/3};
      [p,q,r].forEach((v,i)=>{const dx=v.x-center.x,dy=v.y-center.y,length=Math.hypot(dx,dy)||1;ctx[i?'lineTo':'moveTo'](v.x+dx/length*.5,v.y+dy/length*.5)});
      ctx.closePath();ctx.clip();ctx.transform(X[0],Y[0],X[1],Y[1],X[2],Y[2]);ctx.drawImage(image,0,0);ctx.restore();
    }
    function render(progress){
      if(!geometry)resize();if(progress===last)return;last=progress;
      const small=compact.matches,frame=progress*(small?1925:539),end=small?77:90;
      if(!ready||frame>end){if(painted)clear();return;}
      clear();
      const first=small?4:43,t=clamp((frame-first)/(end-first));
      const angle=(small?-1.343191146850586:-1.6057028770446777)+ease(t,small)*(small?2.3380250334739685:2.5830872654914856);
      const scale=small?1:.9151623845100403,imgScale=small?1.1496707201004028:1.2014410495758057;
      const net=angle-.9937965273857117,A=scale*imgScale*Math.cos(net),B=scale*imgScale*Math.sin(net),co=Math.cos(angle),si=Math.sin(angle);
      const ix=small?157.35128784179688:157.82199096679688,iy=small?8.857076644897461:-112.65656280517578;
      const tx=960.000244140625+scale*((small?-725:-848.8565673828125)+co*ix-si*iy)-A*.23770517110824585*1536+B*.1315237432718277*1055;
      const ty=(small?611.0317993164062:1201.897216796875)+scale*((small?-705:-1329.6981201171875)+si*ix+co*iy)-B*.23770517110824585*1536-A*.1315237432718277*1055;
      const g=geometry,project=(x,y)=>({x:g.width/2+(A*x-B*y+tx-960)*g.fit,y:g.height/2+(B*x+A*y+ty-629)*g.fit});
      const x=vi?128:64,top=vi?30:0;
      const hole=[project(x,0),project(x+416,0),project(x+416,162),project(x,162)];
      const original=[project(x,top),project(x+416,top),project(x+416,162),project(x,162)];
      // Move the whole proximal edge past the viewport by one shared offset.
      // Keeping both edge points on the same translation preserves its native
      // angle; clamping them separately flattened the forearm into a visible
      // cap while the unchanged Rive hand continued underneath it.
      const extension=Math.max(0,Math.max(original[0].y,original[1].y)+2);
      const fixed=original.map((p,i)=>({x:p.x,y:i<2?p.y-extension:p.y}));
      // At the settled angle this is the original quad again. Hand back to
      // untouched native rendering before the phone enters, without a fade.
      path.setAttribute('d','M0 0H'+g.width+'V'+g.height+'H0Z M'+hole.map(p=>p.x+','+p.y).join('L')+'Z');
      nativeCanvas.style.clipPath='url(#df-hero-elbow-cutout)';
      ctx.setTransform(g.ratio,0,0,g.ratio,-g.left*g.ratio,0);painted=true;
      if(vi){
        // VI keeps its native opaque bench. Repaint only the masked quad
        // with that same native background, at its exact static transform.
        ctx.save();ctx.beginPath();hole.forEach((p,i)=>ctx[i?'lineTo':'moveTo'](p.x,p.y));ctx.closePath();ctx.clip();
        const bgScale=(small?1.4183422327041626:.9151623845100403*1.6527979373931885)*g.fit;
        const bgX=small?892.830451965332:960.000244140625+.9151623845100403*(-108.00000762939453);
        const bgY=small?633.377161026001:1201.897216796875+.9151623845100403*(-683.1980590820312);
        ctx.translate(g.width/2+(bgX-960)*g.fit,g.height/2+(bgY-629)*g.fit);ctx.scale(bgScale,bgScale);ctx.drawImage(background,-724,-543);ctx.restore();
      }
      // Use the complete native texture and its original UV coordinates.
      // A cropped 416px bitmap introduced a visible curved seam at the elbow
      // where the crop ended; the full texture lets the lower edge continue
      // pixel-for-pixel into the untouched Rive render.
      const h=162-top,uv=[{x:x,y:top},{x:x+416,y:top},{x:x+416,y:162},{x:x,y:162}];
      triangle(uv[0],uv[1],uv[2],fixed[0],fixed[1],fixed[2]);triangle(uv[0],uv[2],uv[3],fixed[0],fixed[2],fixed[3]);
    }
    function decoded(){loaded++;ready=loaded===(vi?2:1);const previous=last;last=-1;if(previous>=0)render(previous)}
    image.onload=decoded;image.src=vi?'/assets/hero/us-en/hands-native-vi.webp':'/assets/hero/us-en/hands.webp';
    if(background){background.onload=decoded;background.src='/assets/hero/us-en/elbow-bg-vi.webp'}
    resize();
    return {render,resize,reset:function(){last=-1;clear()}};
  };
}());
