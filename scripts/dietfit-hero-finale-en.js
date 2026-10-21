(function () {
  'use strict';
  window.createDietfitHeroFinale = function (hero,stage) {
    const scene = hero.querySelector('.df-hero-finale');
    if (!scene || !document.body.classList.contains('dietfit-home--en')) return null;
    const phone = scene.querySelector('.df-hero-finale__phone');
    const mascot = scene.querySelector('.df-hero-finale__mascot');
    const arm = scene.querySelector('.df-hero-finale__mascot-arm');
    const card = scene.querySelector('.df-hero-finale__card');
    const dashboard = scene.querySelector('.df-hero-dashboard');
    const screen = scene.querySelector('.df-hero-finale__screen');
    const image = screen.querySelector('img');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const compact = window.matchMedia('(max-width: 1024px)');
    const clamp = function (n) { return Math.max(0,Math.min(1,n)); };
    const smooth = function (n) { n=clamp(n); return n*n*n*(n*(n*6-15)+10); };
    const gate = function () { return compact.matches ? 799/1925 : 374/539; };
    let ready=false,preparing=null,last=-1,chapter=0,origin={x:0,y:0},cardTarget={x:0,y:0,scale:1},phoneTarget={x:0,y:0,scale:1};
    function measure() {
      const bounds=stage.getBoundingClientRect();
      scene.style.setProperty('--df-hero-bleed',Math.min(28,Math.max(0,bounds.left-8)).toFixed(1)+'px');
      const saved=card.style.transform,savedPhone=phone.style.transform,savedDashboard=dashboard.style.transform;
      card.style.transform='none';phone.style.transform='translate(-50%,-50%)';dashboard.style.transform='translate(-50%,-50%)';
      const a=phone.getBoundingClientRect(),b=card.getBoundingClientRect();
      const journal=dashboard.querySelector('.df-hero-dashboard__journal').getBoundingClientRect();
      const budget=dashboard.querySelector('.df-hero-dashboard__budget').getBoundingClientRect();
      phoneTarget={x:journal.left+journal.width/2-a.left-a.width/2,y:journal.top+journal.height/2-a.top-a.height/2,scale:a.width?journal.width/a.width:1};
      cardTarget={x:budget.left+budget.width/2-b.left-b.width/2,y:budget.top+budget.height/2-b.top-b.height/2,scale:b.width?budget.width/b.width:1};
      origin={x:a.left+a.width/2-b.left-b.width/2,y:a.top+a.height/2-b.top-b.height/2};
      card.style.transform=saved;phone.style.transform=savedPhone;dashboard.style.transform=savedDashboard;
    }
    function prepare() {
      if(preparing)return;
      preparing=Promise.all(Array.from(scene.querySelectorAll('img')).map(function(img){
        img.loading='eager';return img.decode?img.decode().catch(function(){}):Promise.resolve();
      })).then(function(){ready=true;last=-1;measure();});
    }
    function wave(p) {
      const keys=[[0,0],[.055,0],[.075,-8],[.10,30],[.125,-14],[.15,27],[.175,-7],[.19,0],[1,0]];
      for(let i=1;i<keys.length;i++)if(p<=keys[i][0]){
        const a=keys[i-1],b=keys[i];return a[1]+(b[1]-a[1])*smooth((p-a[0])/(b[0]-a[0]));
      }
      return 0;
    }
    function paint(p) {
      const active=ready&&!motion.matches&&p>0;
      hero.classList.toggle('is-hero-finale',active);
      const peek=smooth(p/.045)*(1-smooth((p-.19)/.055));
      mascot.style.transform='translateY('+((1-peek)*105).toFixed(2)+'%) rotate('+(-1.5*peek).toFixed(2)+'deg)';
      arm.style.transform='rotate('+wave(p).toFixed(2)+'deg)';
      const spread=smooth((p-.27)/.20),morph=smooth((p-.66)/.19);
      card.style.transform='translate('+(origin.x*(1-spread)+morph*cardTarget.x).toFixed(2)+'px,'+(origin.y*(1-spread)+morph*cardTarget.y).toFixed(2)+'px) scale('+(.4+.6*spread+(cardTarget.scale-1)*morph).toFixed(4)+')';
      card.style.opacity=(spread*(1-morph)).toFixed(3);
      const fullHeight=screen.clientWidth*1311/404,maxOffset=Math.max(0,fullHeight-screen.clientHeight);
      const offset=Math.min(fullHeight*.2769,maxOffset);
      image.style.transform='translateY('+(-offset-(maxOffset-offset)*smooth((p-.33)/.3)).toFixed(2)+'px)';
      phone.style.opacity=(1-morph).toFixed(3);
      phone.style.transform='translate(-50%,-50%) translate('+(phoneTarget.x*morph).toFixed(2)+'px,'+(phoneTarget.y*morph).toFixed(2)+'px) scale('+(1+(phoneTarget.scale-1)*morph).toFixed(4)+')';
      dashboard.style.opacity=morph.toFixed(3);
      dashboard.style.transform='translate(-50%,-50%) translateY('+((1-morph)*28).toFixed(2)+'px) scale('+(.9+.1*morph).toFixed(4)+')';
      scene.dataset.phase=p<.045?'peeking':p<.19?'waving':p<.245?'hiding':p<.27?'waiting':p<.47?'revealing':p<.66?'result':p<.85?'dashboard':'complete';
    }
    function reset(){last=-1;chapter=0;hero.classList.remove('is-hero-finale');paint(0);}
    measure();paint(0);
    return {
      progress:function(value,p){
        chapter=clamp(p===undefined?(value-gate())/(1-gate()):p);
        if(value>gate()-.12)prepare();
        if(chapter!==last){last=chapter;paint(chapter);}
        return Math.min(value,gate());
      },
      resize:function(){measure();paint(chapter);},
      reset:reset,
      destroy:reset
    };
  };
}());
