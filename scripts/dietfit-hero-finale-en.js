(function () {
  'use strict';
  window.createDietfitHeroFinale = function (hero,stage) {
    const scene=hero.querySelector('.df-hero-finale');
    if(!scene||!document.body.classList.contains('dietfit-home--en'))return null;
    const find=function(s){return scene.querySelector(s);};
    const phone=find('.df-hero-finale__phone'),hardware=find('.df-hero-finale__hardware');
    const mascot=find('.df-hero-finale__mascot'),arm=find('.df-hero-finale__mascot-arm');
    const screen=find('.df-hero-finale__screen'),snapshot=find('.df-hero-finale__snapshot');
    const snapshotImage=snapshot.querySelector('img'),logControl=find('.df-hero-result__log');
    const budget=find('.df-hero-dashboard__budget'),journal=find('.df-hero-dashboard__journal');
    const surface=find('.df-hero-dashboard__surface'),title=find('.df-hero-dashboard__title'),plan=find('.df-hero-dashboard__plan');
    const result=find('.df-hero-result'),sheet=find('.df-hero-result__sheet'),heading=find('[data-result-heading]');
    const tags=Array.from(scene.querySelectorAll('.df-hero-result__tag'));
    const particles=Array.from(scene.querySelectorAll('.df-hero-finale__nutrients i'));
    const sources=Array.from(scene.querySelectorAll('[data-result-macro]'));
    const destinations=Array.from(scene.querySelectorAll('[data-budget-macro]'));
    const bars=Array.from(scene.querySelectorAll('.df-hero-budget__macros em'));
    const ring=find('.df-hero-budget__ring'),left=find('[data-budget-left]'),food=find('[data-budget-food]'),log=find('[data-result-log]');
    const motion=window.matchMedia('(prefers-reduced-motion: reduce)'),compact=window.matchMedia('(max-width: 1024px)');
    const clamp=function(n){return Math.max(0,Math.min(1,n));};
    const smooth=function(n){n=clamp(n);return n*n*n*(n*(n*6-15)+10);};
    const range=function(p,a,b){return smooth((p-a)/(b-a));};
    const mix=function(a,b,t){return a+(b-a)*t;};
    const gate=function(){return compact.matches?799/1925:374/539;};
    const format=new Intl.NumberFormat('en-US');
    let ready=false,preparing=null,last=-1,chapter=0,geometry=null;
    function measure(){
      const saved=[phone,journal,budget,result,sheet].map(function(el){return el.style.transform;});
      phone.style.transform='translate(-50%,-50%)';journal.style.transform='none';budget.style.transform='none';result.style.transform='none';sheet.style.transform='none';
      const rect=scene.getBoundingClientRect(),p=phone.getBoundingClientRect(),s=screen.getBoundingClientRect();
      const j=journal.getBoundingClientRect(),b=budget.getBoundingClientRect();
      const scale=j.width?s.width/j.width:1,budgetScale=rect.width<=700?.63:(b.width?s.width*.85/b.width:1);
      const start={x:s.left+s.width/2-j.left-j.width/2,y:s.top-j.top,scale:scale};
      const floating={x:p.left-b.width*budgetScale/2-16-b.left-b.width/2,y:p.top+p.height*.43-b.top-b.height/2,scale:budgetScale};
      const origin={x:p.left+p.width/2-b.left-b.width/2,y:p.top+p.height*.43-b.top-b.height/2};
      geometry={start:start,floating:floating,origin:origin,
        phone:{x:j.left+j.width/2-s.left-s.width/2,y:j.top+j.height/2-s.top-s.height/2,scale:s.width?j.width/s.width:1},
        snapshotOffset:Math.min(s.width*1311/404*.2769,Math.max(0,s.width*1311/404-s.height))/scale,
        paths:sources.map(function(el,index){
          const a=el.getBoundingClientRect(),z=destinations[index].getBoundingClientRect();
          return {x:j.left+j.width/2+start.x+(a.left+a.width/2-j.left-j.width/2)*scale-rect.left,
            y:j.top+start.y+(a.top+a.height/2-j.top)*scale-rect.top,
            endX:b.left+b.width/2+floating.x+(z.left+z.width/2-b.left-b.width/2)*budgetScale-rect.left,
            endY:b.top+b.height/2+floating.y+(z.top+z.height/2-b.top-b.height/2)*budgetScale-rect.top};
        })};
      [phone,journal,budget,result,sheet].forEach(function(el,i){el.style.transform=saved[i];});
    }
    function prepare(){
      if(preparing)return;
      preparing=Promise.all(Array.from(scene.querySelectorAll('img')).map(function(img){
        img.loading='eager';return img.decode?img.decode().catch(function(){}):Promise.resolve();
      })).then(function(){ready=true;last=-1;measure();});
    }
    function wave(p){
      const keys=[[0,0],[.055,0],[.075,-8],[.10,30],[.125,-14],[.15,27],[.175,-7],[.19,0],[1,0]];
      for(let i=1;i<keys.length;i++)if(p<=keys[i][0]){
        const a=keys[i-1],b=keys[i];return mix(a[1],b[1],smooth((p-a[0])/(b[0]-a[0])));
      }
      return 0;
    }
    function paint(p){
      hero.classList.toggle('is-hero-finale',ready&&!motion.matches&&p>0);
      if(!geometry)return;
      const g=geometry,peek=range(p,0,.045)*(1-range(p,.19,.245));
      mascot.style.transform='translateY('+((1-peek)*105).toFixed(2)+'%) rotate('+(-1.5*peek).toFixed(2)+'deg)';
      arm.style.transform='rotate('+wave(p).toFixed(2)+'deg)';
      // The same two opaque panels travel into the dashboard. No duplicate UI crossfade.
      const spread=range(p,.27,.38),reveal=range(p,.31,.46),transfer=range(p,.52,.68),dock=range(p,.72,.88);
      const x=mix(g.origin.x,g.floating.x,spread)*(1-dock),y=mix(g.origin.y,g.floating.y,spread)*(1-dock);
      budget.style.transform='translate('+x.toFixed(2)+'px,'+y.toFixed(2)+'px) scale('+mix(mix(.4,g.floating.scale,spread),1,dock).toFixed(4)+')';
      budget.style.visibility=p>.27?'visible':'hidden';
      budget.style.opacity='1';
      journal.style.transform='translate('+(g.start.x*(1-dock)).toFixed(2)+'px,'+(g.start.y*(1-dock)).toFixed(2)+'px) scale('+mix(g.start.scale,1,dock).toFixed(4)+')';
      journal.style.borderRadius=mix(40,16,dock).toFixed(2)+'px';
      snapshot.style.visibility=reveal<1?'visible':'hidden';
      snapshotImage.style.transform='translateY('+(-g.snapshotOffset).toFixed(2)+'px)';
      result.style.transform='translateY('+((1-reveal)*100).toFixed(3)+'%)';
      sheet.style.transform='translateY('+((1-range(p,.37,.49))*42).toFixed(3)+'%)';
      tags.forEach(function(tag,i){tag.style.transform='scale('+range(p,.36+i*.025,.40+i*.025).toFixed(4)+')';tag.style.opacity=(1-range(p,.71,.75)).toFixed(3);});
      hardware.style.opacity=(1-range(p,.73,.78)).toFixed(3);
      phone.style.transform='translate(-50%,-50%) translate('+(g.phone.x*dock).toFixed(2)+'px,'+(g.phone.y*dock).toFixed(2)+'px) scale('+mix(1,g.phone.scale,dock).toFixed(4)+')';
      // Calories and macros arrive in the budget, just as the meal-plans reference.
      left.textContent=format.format(Math.round(mix(1210,590,transfer)));
      food.textContent=format.format(Math.round(mix(990,1610,transfer)));
      ring.style.strokeDashoffset=(1-mix(990/2200,1610/2200,transfer)).toFixed(4);
      const initial=[140,49,26],added=[78,23,24],goals=[230,120,70];
      destinations.forEach(function(el,i){const value=mix(initial[i],initial[i]+added[i],transfer);el.textContent=Math.round(value)+'g';bars[i].style.transform='scaleX('+clamp(value/goals[i]).toFixed(4)+')';});
      particles.forEach(function(dot,i){
        const t=clamp((p-.49-(i%3)*.018-Math.floor(i/3)*.018)/.11),path=g.paths[Math.floor(i/3)];
        const travel=smooth(t),arc=Math.sin(t*Math.PI)*(36+i%3*10);
        dot.style.transform='translate('+mix(path.x,path.endX,travel).toFixed(2)+'px,'+(mix(path.y,path.endY,travel)-arc).toFixed(2)+'px) scale('+(t>0&&t<1?1:0)+')';
      });
      log.textContent=transfer===1?'Meal logged':'Log meal';
      logControl.classList.toggle('is-logged',transfer===1);
      heading.textContent=dock>.5?'Food journal':'Scan result';
      surface.style.clipPath='inset(0 0 '+((1-range(p,.85,.92))*100).toFixed(2)+'% round 24px)';
      title.style.clipPath='inset(0 '+((1-range(p,.83,.91))*100).toFixed(2)+'% 0 0)';
      plan.style.clipPath='inset(0 0 '+((1-range(p,.82,.93))*100).toFixed(2)+'% round 16px)';
      plan.style.transform='translateY('+((1-range(p,.82,.93))*-24).toFixed(2)+'px)';
      scene.dataset.phase=p<.045?'peeking':p<.19?'waving':p<.245?'hiding':p<.27?'waiting':p<.49?'revealing':p<.70?'transferring':p<.93?'docking':'complete';
    }
    function reset(){last=-1;chapter=0;paint(0);hero.classList.remove('is-hero-finale');}
    measure();paint(0);
    return {
      progress:function(value,p){
        chapter=clamp(p===undefined?(value-gate())/(1-gate()):p);
        if(value>gate()-.12)prepare();
        if(chapter!==last){last=chapter;paint(chapter);}
        return Math.min(value,gate());
      },
      resize:function(){measure();paint(chapter);},reset:reset,destroy:reset
    };
  };
}());
