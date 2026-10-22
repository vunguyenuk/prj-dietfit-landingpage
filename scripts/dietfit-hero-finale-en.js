(function () {
  'use strict';
  window.createDietfitHeroFinale = function (hero,stage) {
    const scene=hero.querySelector('.df-hero-finale');
    if(!scene||!document.body.classList.contains('dietfit-home--en'))return null;
    const find=function(s){return scene.querySelector(s);};
    const phone=find('.df-hero-finale__phone'),hardware=find('.df-hero-finale__hardware');
    const mascot=find('.df-hero-finale__mascot'),arm=mascot.querySelector('.df-mascot__arm');
    const screen=find('.df-hero-finale__screen'),logControl=find('.df-hero-result__log');
    const budget=find('.df-hero-dashboard__budget'),journal=find('.df-hero-dashboard__journal');
    const title=find('.df-hero-dashboard__title'),plan=find('.df-hero-dashboard__plan');
    const result=find('.df-hero-result'),sheet=find('.df-hero-result__sheet');
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
      journal.style.setProperty('--df-result-scale',(j.width/375).toFixed(6));
      const scale=j.width?s.width/j.width:1,budgetScale=rect.width<=700?.63:(b.width?s.width*.85/b.width:1);
      const start={x:s.left+s.width/2-j.left-j.width/2,y:s.top-j.top,scale:scale};
      const floating={x:p.left-b.width*budgetScale/2-16-b.left-b.width/2,y:p.top+p.height*.43-b.top-b.height/2,scale:budgetScale};
      const origin={x:p.left+p.width/2-b.left-b.width/2,y:p.top+p.height*.43-b.top-b.height/2};
      geometry={start:start,floating:floating,origin:origin,resultRadius:j.width*54/375,
        phone:{x:j.left+j.width/2-p.left-p.width/2-(s.left+s.width/2-p.left-p.width/2)/scale,
          y:j.top+j.height/2-p.top-p.height/2-(s.top+s.height/2-p.top-p.height/2)/scale,scale:s.width?j.width/s.width:1},
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
    function paint(p){
      hero.classList.toggle('is-hero-finale',ready&&!motion.matches&&p>0);
      if(!geometry)return;
      const g=geometry,peek=range(p,0,.045)*(1-range(p,.19,.245));
      mascot.style.transform='translateX('+(105-73*peek).toFixed(2)+'%) rotate('+(-24*peek).toFixed(2)+'deg)';
      // Reuse the helper's shoulder pivot and full arm gesture. Scroll owns the
      // pose so stopping, reversing or hiding the hero never starts a timer.
      if(arm)arm.style.transform='rotate('+window.dietfitMascotWave.angleAt(clamp((p-.055)/.135)).toFixed(3)+'deg)';
      mascot.style.visibility=peek>0?'visible':'hidden';
      // The same two opaque panels travel into the dashboard. No duplicate UI crossfade.
      const spread=range(p,.27,.38),transfer=range(p,.52,.68),dock=range(p,.72,.88);
      const x=mix(g.origin.x,g.floating.x,spread)*(1-dock),y=mix(g.origin.y,g.floating.y,spread)*(1-dock);
      budget.style.transform='translate('+x.toFixed(2)+'px,'+y.toFixed(2)+'px) scale('+mix(mix(.4,g.floating.scale,spread),1,dock).toFixed(4)+')';
      budget.style.visibility=p>.27?'visible':'hidden';
      budget.style.opacity='1';
      journal.style.transform='translate('+(g.start.x*(1-dock)).toFixed(2)+'px,'+(g.start.y*(1-dock)).toFixed(2)+'px) scale('+mix(g.start.scale,1,dock).toFixed(4)+')';
      journal.style.borderRadius=g.resultRadius.toFixed(2)+'px';
      // Show the complete Figma Meal Detail from the start. The old scrolled
      // information screenshot must never remain underneath a second UI sheet.
      result.style.transform='none';
      sheet.style.transform='none';
      // Keep the physical frame and island attached through the complete docking.
      hardware.style.opacity='1';
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
      title.style.clipPath='inset(0 '+((1-range(p,.83,.91))*100).toFixed(2)+'% 0 0)';
      // Reveal the plan after hardware docks, so it cannot cross the card edge.
      plan.style.clipPath='inset(0 0 '+((1-range(p,.88,.97))*100).toFixed(2)+'% round 16px)';
      plan.style.transform='translateY('+((1-range(p,.88,.97))*-24).toFixed(2)+'px)';
      scene.dataset.phase=p<.045?'peeking':p<.19?'waving':p<.245?'hiding':p<.27?'waiting':p<.49?'revealing':p<.70?'transferring':p<.97?'docking':'complete';
    }
    function reset(){last=-1;chapter=0;paint(0);hero.classList.remove('is-hero-finale');}
    measure();paint(0);
    if(document.fonts)document.fonts.ready.then(function(){measure();paint(chapter);});
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
