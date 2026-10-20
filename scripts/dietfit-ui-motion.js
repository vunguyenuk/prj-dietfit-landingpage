/* Scroll-led app demonstrations. All state changes use sample data and yield to manual input. */
(() => {
  'use strict';
  const root=document.querySelector('.dietfit-product');
  if(!root || !('IntersectionObserver' in window)) return;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)'), compact=matchMedia('(max-width:767px)'), wide=matchMedia('(min-width:1101px)');
  const chapters=[...root.querySelectorAll('[data-ui-chapter]')].map(element=>({element,kind:element.dataset.uiChapter,panel:element.querySelector('.df-demo-display,.df-health-board'),pulls:[...element.querySelectorAll('.df-ui-pull')],steps:[...element.querySelectorAll('[data-scan-stage],[data-sara-stage]')],timers:[],started:false,phoneVisible:false}));
  const active=new Set(), clamp=n=>Math.max(0,Math.min(1,n));
  const owned=['--df-phone-x','--df-phone-lift','--df-phone-roll','--df-phone-yaw','--df-phone-scale','--df-board-lift','--df-sweep'];
  let frame=0;
  const isManual=chapter=>chapter.element.dataset.uiManual==='true' || chapter.element.dataset.scanManual==='true';
  const stopTimers=chapter=>{chapter.timers.forEach(clearTimeout);chapter.timers=[];};
  function selectStep(chapter,index) {
    if(isManual(chapter) || reduce.matches) return;
    if(chapter.element.dataset.motionStep===String(index)) return;
    chapter.element.dataset.motionStep=String(index);
    if(chapter.kind==='scan') {
      const status=chapter.element.querySelector('.df-scroll-status');
      if(status) status.textContent=`0${index+1} / 03`;
      chapter.element.dispatchEvent(new CustomEvent('dietfit:scan-step',{detail:['capture','identify','edit'][index]}));
    } else if(chapter.kind==='coach') chapter.element.dispatchEvent(new CustomEvent('dietfit:coach-choice',{detail:index}));
  }
  function playCompactDemo(chapter) {
    if(chapter.started || wide.matches || reduce.matches || isManual(chapter)) return;
    chapter.started=true;
    selectStep(chapter,0);
    const delays=chapter.kind==='scan' ? [1000,3000] : [3600,7200];
    delays.forEach((delay,i)=>chapter.timers.push(setTimeout(()=>{
      if(chapter.phoneVisible && !document.hidden && !wide.matches) selectStep(chapter,i+1);
    },delay)));
  }
  chapters.forEach(chapter=>{
    const takeControl=event=>{
      if(event.target.closest('button,input,a')) {chapter.element.dataset.uiManual='true';stopTimers(chapter);}
    };
    ['pointerdown','focusin','click','input'].forEach(type=>chapter.element.addEventListener(type,takeControl,true));
  });
  function render() {
    frame=0;
    root.classList.toggle('df-ui-motion-enabled',!reduce.matches);
    for(const chapter of chapters) {
      const el=chapter.element;
      if(reduce.matches) {
        stopTimers(chapter);
        owned.forEach(name=>el.style.removeProperty(name));
        chapter.pulls.forEach(pull=>['--df-pull-opacity','--df-pull-x','--df-pull-y','--df-pull-turn'].forEach(name=>pull.style.removeProperty(name)));
        continue;
      }
      if(!active.has(el) || isManual(chapter)) continue;
      const section=el.getBoundingClientRect(), panel=chapter.panel.getBoundingClientRect();
      const progress=clamp((innerHeight-panel.top)/(innerHeight+panel.height));
      const entry=clamp((progress-.06)/.5), remain=1-entry, small=compact.matches;
      el.style.setProperty('--df-phone-x',`${(remain*(small?0:38)).toFixed(2)}px`);
      el.style.setProperty('--df-phone-lift',`${(remain*(small?22:58)).toFixed(2)}px`);
      el.style.setProperty('--df-phone-roll',`${(-remain*(small?1.2:5)).toFixed(2)}deg`);
      el.style.setProperty('--df-phone-yaw',`${(remain*(small?0:14)).toFixed(2)}deg`);
      el.style.setProperty('--df-phone-scale',(1-remain*(small ? .035 : .12)).toFixed(4));
      el.style.setProperty('--df-board-lift',`${(remain*(small?18:40)).toFixed(2)}px`);
      el.style.setProperty('--df-sweep',clamp((innerHeight-section.top)/(section.height||1)).toFixed(3));
      chapter.pulls.forEach((pull,i)=>{
        const reveal=clamp((progress-.08)*2.8-i*.12);
        pull.style.setProperty('--df-pull-opacity',(.25+.75*reveal).toFixed(3));
        pull.style.setProperty('--df-pull-x',`${((1-reveal)*-24).toFixed(2)}px`);
        pull.style.setProperty('--df-pull-y',`${((1-reveal)*28).toFixed(2)}px`);
        pull.style.setProperty('--df-pull-turn',`${((1-reveal)*(i%2?3:-3)).toFixed(2)}deg`);
      });
      if(!wide.matches || !chapter.steps.length) continue;
      let index=0;
      chapter.steps.forEach((step,i)=>{if(step.getBoundingClientRect().top<innerHeight*.6) index=i;});
      selectStep(chapter,index);
    }
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(render);}
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{if(entry.isIntersecting)active.add(entry.target);else active.delete(entry.target);});schedule();
  },{rootMargin:'160px 0px',threshold:0});
  const phoneObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      const chapter=chapters.find(item=>item.element.contains(entry.target));
      chapter.phoneVisible=entry.isIntersecting && entry.intersectionRatio>=.6;
      chapter.element.classList.toggle('is-demo-in-view',chapter.phoneVisible);
      if(chapter.phoneVisible && wide.matches && chapter.kind==='coach' && !isManual(chapter) && !reduce.matches) {
        chapter.element.dispatchEvent(new CustomEvent('dietfit:coach-choice',{detail:Number(chapter.element.dataset.motionStep)||0}));
      }
      if(chapter.phoneVisible) playCompactDemo(chapter);
      else {stopTimers(chapter);chapter.started=false;}
    });
  },{threshold:[0,.6]});
  chapters.forEach(chapter=>{
    observer.observe(chapter.element);
    if(['scan','coach'].includes(chapter.kind))phoneObserver.observe(chapter.element.querySelector('.df-phone'));
  });
  document.addEventListener('visibilitychange',()=>{
    chapters.forEach(chapter=>{
      if(document.hidden){stopTimers(chapter);chapter.started=false;}
      else if(chapter.phoneVisible)playCompactDemo(chapter);
    });
  });
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule,{passive:true});
  [reduce,compact,wide].forEach(query=>query.addEventListener('change',schedule));
  render();
})();
