/* App renderers adapted directly from v2 app.js. Document scroll owns progress. */
(() => {'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),seg=(p,a,b)=>clamp((p-a)/(b-a)),eOut=t=>1-Math.pow(1-t,3),fmt=n=>Math.round(n).toLocaleString('en-US');
const IC = {
  cancel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="9.5"/><path d="M9.6 9.3a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .8-1 1.5v.5"/><path d="M12 16.8h.01" stroke-width="2.2"/></svg>',
  imgadd: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M11.5 3H8a5 5 0 0 0-5 5v8a5 5 0 0 0 5 5h8a5 5 0 0 0 5-5v-3.5"/><path d="m3.5 17 4.2-4.2a2 2 0 0 1 2.8 0l4.3 4.3M13.5 15.5l1.3-1.3a2 2 0 0 1 2.8 0l3 3"/><path d="M18 2.5v6M15 5.5h6"/></svg>',
  flashoff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9.2 6 12 2.5h1l-1 7h5.5l-1.8 2.6M13.5 15.6 11 21.5h-1l1-7H5.5l2-3"/><path d="m3 3 18 18"/></svg>',
  chev: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="m4 6 4 4 4-4"/></svg>',
  arrowR: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square"><path d="M20 12H4M14.5 6.5 20 12l-5.5 5.5"/></svg>',
  arrowL: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square"><path d="M4 12h16M9.5 6.5 4 12l5.5 5.5"/></svg>',
  add: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  remove: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M5 12h14"/></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="m14 6 4 4M4 20l1-4.6L15.6 4.8a2.2 2.2 0 0 1 3.1 0l.5.5a2.2 2.2 0 0 1 0 3.1L8.6 19z"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M9 6l.6-2h4.8l.6 2M6 6l.9 13a2 2 0 0 0 2 2h6.2a2 2 0 0 0 2-2L18 6M10 10.5v6M14 10.5v6"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="9.5"/><path d="M12 16.5v-5"/><path d="M12 8h.01" stroke-width="2.2"/></svg>',
  share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M8 7l4-4 4 4M5 13v4a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4v-4"/></svg>',
  more: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5.5" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="12" cy="18.5" r="1.7"/></svg>',
  ai: '<svg viewBox="0 0 24 24"><defs><linearGradient id="aig" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FF9500"/><stop offset=".55" stop-color="#FE692E"/><stop offset="1" stop-color="#E54D2E"/></linearGradient></defs><path fill="url(#aig)" d="M10 2.2l2.1 5.6 5.6 2.1-5.6 2.1L10 17.6 7.9 12 2.3 9.9 7.9 7.8zM18.2 13.2l1 2.6 2.6 1-2.6 1-1 2.6-1-2.6-2.6-1 2.6-1z"/></svg>',
  flame: '<svg viewBox="0 0 28 28"><path fill="#FE692E" d="M14 2.5c2.4 4.6 7.5 7 7.5 13.2a7.5 7.5 0 0 1-15 0c0-3.8 1.9-6 3.5-7.4.3 2.4 1.6 3.8 2.9 4.2C12.8 9 13.5 5.5 14 2.5Z"/><path fill="#FFB27A" d="M14 13.5c1.2 2 3.3 3 3.3 5.6a3.3 3.3 0 0 1-6.6 0c0-1.5.8-2.5 1.5-3.1.2 1 .7 1.6 1.2 1.8.1-1.7.4-3 .6-4.3Z"/></svg>',
  carb: '<svg viewBox="0 0 16 16" fill="none" stroke="#d99a1e" stroke-width="1.3" stroke-linecap="round"><path d="M8 15V5"/><path d="M8 13c-2.3 0-3.5-1.3-3.5-3.2C6.6 9.8 8 11 8 13Zm0 0c2.3 0 3.5-1.3 3.5-3.2C9.4 9.8 8 11 8 13ZM8 9.5c-2.1 0-3.2-1.2-3.2-3C6.7 6.5 8 7.6 8 9.5Zm0 0c2.1 0 3.2-1.2 3.2-3C9.3 6.5 8 7.6 8 9.5ZM8 5c-.9-.8-1.3-1.8-1-3.4C8.4 2.4 8.7 3.6 8 5Zm0 0c.9-.8 1.3-1.8 1-3.4"/></svg>',
  prot: '<svg viewBox="0 0 16 16" fill="none" stroke="#e5484d" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M2 11.5c1.6-1.6 1.2-4 3-5.4S9.2 6 10.6 4.4 12.8 2.5 14 2.5M2 13.5c1.6-1.6 1.2-4 3-5.4s4.2 0 5.6-1.6S12.8 4.5 14 4.5"/></svg>',
  fat: '<svg viewBox="0 0 16 16" fill="none" stroke="#e0a800" stroke-width="1.3" stroke-linejoin="round"><path d="M1.8 8.5 13.5 3.5l.7 5v4.3H1.8z"/><path d="M1.8 8.5h12.4"/><circle cx="5" cy="10.8" r=".9"/><circle cx="10.5" cy="10.3" r=".7"/></svg>',
};
/* ingredient data: [name, grams, popover x, popover y (screen px), crop x%, crop y%, kcal] — crops point at the item inside meal.jpg */
const ING = [
  ['Roast chicken', 120, 229, 318, 60, 36, 250],
  ['Farro', 100, 266, 446, 68, 58, 135],
  ['Figs', 50, 104, 300, 24, 40, 37],
  ['Egg', 50, 118, 486, 33, 66, 78],
  ['Olives', 30, 240, 492, 62, 66, 46],
  ['Bitter greens', 40, 146, 414, 42, 54, 12],
];
function phoneFlow() {
  const app = $('#app'); if (!app) return () => {};
  $$('[data-ic]', app).forEach(e => { e.innerHTML = IC[e.dataset.ic] || ''; });
  const crop = (x, y) => `background-image:url(/assets/product/v2/meal.jpg);background-size:520%;background-position:${x}% ${y}%`;
  const regionColors = ['#b477fd', '#ffac60', '#2ab0f9', '#21cbb2'];
  $('#pops').innerHTML = ING.slice(0, 4).map((g, j) => `<div class="pop" style="left:${g[2]}px;top:${g[3]}px;--region:${regionColors[j]}"><b><span class="pop-name">${g[0]} <small>${g[1]}g</small></span><span class="pop-kcal">${g[6]} <small>kcal</small></span></b><i></i></div>`).join('');
  $('#avs').innerHTML = ING.slice(0, 3).map(g => `<i style="${crop(g[4], g[5])}"></i>`).join('') + `<em>+${ING.length - 3}</em>`;
  $('#ul').innerHTML = ING.map(g => `<li><i style="${crop(g[4], g[5])}"></i><span>${g[0]}<small class="ingredient-kcal">${g[6]} kcal</small></span><b>${g[1]}<small>g</small></b></li>`).join('');
  const S = { cam: $('#a-cam'), ana: $('#a-ana'), lst: $('#a-lst'), calc: $('#a-calc'), md: $('#a-md') };
  const pops = $$('.pop', app), lis = $$('#ul li', app), sb = $('#sb'), hi = $('#hi');
  const show = k => Object.entries(S).forEach(([n, el]) => el.classList.toggle('on', n === k));
  const K = { k: $('#mdK'), c: $('#mdC'), p: $('#mdP'), f: $('#mdF'), s: $('#mdS2') };
  return function render(p) {
    // zoom of the live camera image (hand moving closer)
    $$('.mealimg', S.cam).forEach(i => i.style.setProperty('--z', 1.12 - .12 * eOut(seg(p, 0, .12))));
    const shot = seg(p, .12, .16);
    $('#shut i').style.transform = `scale(${shot > 0 && shot < 1 ? .86 : 1})`;
    $('#flash').style.opacity = shot > 0 ? (1 - seg(p, .15, .2)) * .9 : 0;
    let k = 'cam';
    if (p >= .15) k = 'ana';
    if (p >= .47) k = 'lst';
    if (p >= .62) k = 'calc';
    if (p >= .76) k = 'md';
    show(k);
    const dark = k === 'calc' || k === 'md' && false; sb.classList.toggle('dk', k === 'calc' || k === 'lst'); hi.classList.toggle('dk', k !== 'cam' && k !== 'ana');
    if (k === 'ana') {
      // white band sweeps the scan box (down, up, down) while the sheet says "Identifying"
      const sw = seg(p, .16, .32), y = Math.sin(sw * Math.PI * 1.5 - Math.PI / 2) * .5 + .5;
      $('#band').style.top = (-198 + y * 418) + 'px'; $('#band').style.opacity = sw < 1 ? 1 : 0;
      const id = seg(p, .15, .18) * (1 - seg(p, .31, .34)); $('#idf').style.transform = `translateY(${(1 - id) * 115}px)`; $('#masc').style.opacity = id; $('#masc').style.transform = `translateY(calc(-100% + ${(1 - id) * 60}px))`;
      pops.forEach((el, j) => { const a = seg(p, .33 + j * .02, .36 + j * .02); el.style.opacity = a; el.style.transform = `scale(${.6 + .4 * eOut(a)})`; });
      $$('.food-regions path', app).forEach((el, j) => {
        const a = eOut(seg(p, .25 + j * .012, .31 + j * .012));
        el.style.opacity = a;
        el.style.strokeDashoffset = 1 - a;
      });
      $('#a-ana').classList.toggle('identified', p >= .33);
      const d = seg(p, .38, .42); $('#dsh').style.transform = `translateY(${(1 - eOut(d)) * 190}px)`;
    }
    if (k === 'lst') {
      const u = seg(p, .47, .51); $('#lst').style.transform = `translateY(${(1 - eOut(u)) * 760}px)`; $('.ov', S.lst).style.opacity = u;
      lis.forEach((li, j) => { const a = seg(p, .5 + j * .012, .53 + j * .012); li.style.opacity = a; li.style.transform = `translateX(${(1 - eOut(a)) * 30}px)`; });
    }
    if (k === 'calc') {
      const c = seg(p, .62, .66); $('#ccard').style.transform = `scale(${.94 + .06 * eOut(c)})`;
      $('#chk').style.opacity = seg(p, .68, .7); $('#chk path').style.strokeDashoffset = 40 * (1 - seg(p, .69, .72));
      const e = seg(p, .64, .69); $('#cegg').style.transform = `translateY(${(1 - eOut(e)) * 80}px) rotate(${(1 - e) * 12}deg)`; $('#cegg').style.opacity = e;
    }
    if (k === 'md') {
      const m = seg(p, .76, .8); S.md.style.transform = `translateY(${(1 - eOut(m)) * 40}px)`;
      const n = eOut(seg(p, .8, .88)); K.k.textContent = fmt(558 * n); K.c.textContent = Math.round(37 * n); K.p.textContent = Math.round(41 * n); K.f.textContent = Math.round(26 * n); K.s.textContent = Math.round(78 * n);
      $('#mdPin').style.left = (78 * n) + '%';
      $('#mdS').style.transform = `translateY(${-eOut(seg(p, .88, 1)) * 250}px)`;
    } else S.md.style.transform = '';
  };
}

function saraScene() {
  const chat = $('#chat'), scroll = $('#caScroll'), body = $('.ca-body', chat), inp = $('#caIn'), txt = $('#caTxt'), ph = $('#caPh'), up = $('#caUp');
  const msgs = $$('[data-s]', scroll), chips = $('#caChips');
  $$('[data-words]', scroll).forEach(el => { el.innerHTML = el.textContent.trim().split(/\s+/).map(w => `<span class="w">${w} </span>`).join(''); });
  const words = $$('[data-words]', scroll).map(el => $$('.w', el));
  const sum = $('.sum', scroll);
  const sizeU = () => chat.style.setProperty('--cu', Math.min(1.25, chat.clientWidth / 380) + 'px');
  sizeU();
  new ResizeObserver(() => {
    sizeU();
    const off = Math.max(0, scroll.scrollHeight - body.clientHeight);
    scroll.style.transform = `translateY(${-off}px)`;
  }).observe(chat);
  const Q = ['Is this food healthy?', 'What should I eat before bed?'];
  function typed(q, a) { const n = Math.round(Q[q].length * clamp(a)); return Q[q].slice(0, n); }
  return function render(p) {
    // timeline: type Q1 → send photo → typing → answer words → type Q2 → send → typing → answer + summary
    const show = [p > .1, p > .1 && p < .19, p >= .19, p > .46, p > .46 && p < .55, p >= .55];
    msgs.forEach((m, i) => { m.hidden = !show[i]; });
    const w1 = seg(p, .19, .34), w2 = seg(p, .55, .72);
    words[0].forEach((w, i) => { w.style.opacity = i < w1 * words[0].length ? 1 : 0; });
    words[1].forEach((w, i) => { w.style.opacity = i < w2 * words[1].length ? 1 : 0; });
    sum.style.opacity = seg(p, .72, .76); sum.hidden = p < .72;
    let t = '';
    if (p < .1) t = typed(0, seg(p, .02, .09)); else if (p > .37 && p <= .46) t = typed(1, seg(p, .37, .45));
    txt.textContent = t; ph.hidden = !!t; up.classList.toggle('on', !!t);
    inp.classList.toggle('think', (p > .1 && p < .19) || (p > .46 && p < .55));
    chips.style.opacity = p > .34 && p < .37 || p > .76 ? 1 : 0;
    chips.innerHTML = p > .76 ? '<span>Will eating before bed affect my sleep? →</span><span>How much protein do I need? →</span>' : '<span>How many calories are in this salmon? →</span><span>Log this meal →</span>';
    const off = Math.max(0, scroll.scrollHeight - body.clientHeight);
    scroll.style.transform = `translateY(${-off}px)`;
  };
}

const SLOTS = [
  { name: 'Breakfast', ic: '☀', opts: [['A', 'Brunch plate with eggs & steak', 800, 6], ['E', 'Street tacos, three ways', 430, 5]] },
  { name: 'Lunch', ic: '◐', opts: [['P', 'Shrimp & black sticky rice plate', 358, 4], ['C', 'Miso ramen with chashu', 690, 7]] },
  { name: 'Dinner', ic: '☾', opts: [['D', 'Chicken & lamb kabob plate', 685, 6], ['B', 'Grilled pork chop & broken rice', 680, 7]] },
];
function dayScene() {
  const days = [['Sun', 27], ['Mon', 28], ['Tue', 29], ['Wed', 30], ['Thu', 1], ['Fri', 2], ['Sat', 3]];
  $('#week').innerHTML = days.map((d, i) => `<span class="${i === 6 ? 'on' : ''}">${d[0]}<i>${d[1]}</i></span>`).join('');
  const st = SLOTS.map(() => ({ i: 0, tick: false }));
  const host = $('#slots');
  function row(s, j) {
    const o = s.opts[st[j].i];
    return `<div class="slot"><small><span aria-hidden="true">${s.ic}</span>${s.name}</small><div class="mrow${st[j].tick ? ' logged' : ''}" data-j="${j}"><img class="plan-photo" src="/assets/product/v2/scan/${o[0]}-photo.jpg" alt="${o[1]}">
      <span class="meal-info"><b>${o[1]}</b><span class="kc"><img src="/assets/product/v2/icons/calorie.svg" alt="">${fmt(o[2])} kcal</span><span class="mm">${o[3]} ingredients · from Deep Scan</span></span>
      <span class="meal-actions"><button data-a="swap" aria-label="Swap ${s.name.toLowerCase()} meal">Swap meal</button><button data-a="tick" aria-label="${st[j].tick ? 'Unlog' : 'Log'} ${s.name.toLowerCase()}" aria-pressed="${st[j].tick}">${st[j].tick ? '✓ Logged' : '○ Tick'}</button></span></div></div>`;
  }
  function draw() {
    const focused = host.contains(document.activeElement) ? document.activeElement : null;
    const focusRow = focused?.closest('.mrow')?.dataset.j, focusAction = focused?.dataset.a;
    host.innerHTML = SLOTS.map(row).join('');
    $('#planSum').textContent = fmt(SLOTS.reduce((a, s, j) => a + s.opts[st[j].i][2], 0));
    $('#planTick').textContent = st.filter(s => s.tick).length;
    const progress = $('.plan-progress');
    progress.setAttribute('aria-valuenow', st.filter(s => s.tick).length);
    progress.style.setProperty('--logged', st.filter(s => s.tick).length / SLOTS.length);
    window.DietFitMotion?.updatePlan();
    if (focusAction) $(`.mrow[data-j="${focusRow}"] button[data-a="${focusAction}"]`, host)?.focus({ preventScroll: true });
  }
  let userEdited = false;
  const manualTimers=new Set();
  host.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; userEdited = true; const j = +b.closest('.mrow').dataset.j;
    if (b.dataset.a === 'swap') { const r = b.closest('.mrow'); r.classList.add('out'); const timer=setTimeout(() => { manualTimers.delete(timer);st[j].i = (st[j].i + 1) % SLOTS[j].opts.length; st[j].tick = false; draw(); const n = $(`.mrow[data-j="${j}"]`); n.classList.add('out'); requestAnimationFrame(() => requestAnimationFrame(() => n.classList.remove('out'))); }, 220);manualTimers.add(timer); }
    else { st[j].tick = !st[j].tick; draw(); } });
  draw();
  const api = { resume(){userEdited=false;manualTimers.forEach(clearTimeout);manualTimers.clear();for(let j=0;j<3;j++)clearTimeout(api['t'+j]);draw();}, set(j, i, tick) { if (userEdited || st[j].i === i && st[j].tick === !!tick) return; const r = $(`.mrow[data-j="${j}"]`); const swap = st[j].i !== i;
      st[j].i = i; st[j].tick = !!tick; if (!swap) { draw(); return; } r && r.classList.add('out'); clearTimeout(api['t' + j]);
      api['t' + j] = setTimeout(() => { draw(); const n = $(`.mrow[data-j="${j}"]`); n.classList.add('out'); requestAnimationFrame(() => requestAnimationFrame(() => n.classList.remove('out'))); }, 200); } };
  window.__plan = api;
  return api;
}

/* A scroll-led tour gives way to direct interaction as soon as it is used. */
function runnerPhoneScene() {
  const host = $('#activityApp'), device = $('#runDevice'), stage = $('#runUi');
  const tabs = $$('[data-run-tab]', host), screens = $$('.run-screen', host);
  const options = $$('[data-dinner]', host), originalAdvice = $('.pk-a', host).textContent;
  const meals = {
    D: { name: 'Kabob platter with rice', kcal: 685 },
    A: { name: 'Steak & eggs brunch plate', kcal: 800 }
  };
  let manual = false, screen = 'home', selected = 'D', logged = null;
  host.addEventListener('focusin', () => { manual = true; draw(); });
  function show(id, user = false) {
    if (user) { manual = true; draw(); }
    screen = id;
    screens.forEach(el => { el.hidden = el.id !== id; });
    tabs.forEach(tab => {
      const active = tab.dataset.runTab === id;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
  }
  function draw() {
    const consumed = 460 + (logged ? meals[logged].kcal : 0), left = 2329 - consumed;
    $('#gCons').textContent = fmt(consumed); $('#gLeft').textContent = fmt(left);
    $('#gArc').setAttribute('stroke-dasharray', `${left / 2329 * 100} 100`);
    $('#home .gauge').setAttribute('aria-label', `${fmt(left)} calories left of a 2,329 goal`);
    options.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.dinner === selected)));
    $('.pk-a', host).textContent = selected === 'D' ? originalAdvice : 'Steak & eggs brunch plate · 800 kcal. Rest-day meal. For tomorrow’s long run, Sara’s better pick is the kabob platter with rice.';
    $('#logDinner').textContent = logged === selected ? 'Remove dinner from log' : `Log dinner · ${meals[selected].kcal} kcal`;
    $('#runLogged').hidden = !logged;
    if (logged) {
      $('#runLoggedName').textContent = meals[logged].name;
      $('#runLoggedPhoto').src = `/assets/product/v2/scan/${logged}-photo.jpg`;
      $('#runLoggedPhoto').alt = meals[logged].name;
    }
    window.DietFitMotion?.updateHome();
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => show(tab.dataset.runTab, true));
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (i + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      show(tabs[next].dataset.runTab, true); tabs[next].focus({ preventScroll: true });
    });
  });
  $('#askDinner').addEventListener('click', () => { show('pick', true); $('#runSaraTab').focus({ preventScroll: true }); });
  options.forEach(button => button.addEventListener('click', () => {
    manual = true; selected = button.dataset.dinner; draw();
    $('#runAnnouncement').textContent = `${meals[selected].name} selected. ${meals[selected].kcal} kcal.`;
  }));
  function finishLog(remove = false) {
    manual = true;
    logged = remove || logged === selected ? null : selected;
    draw(); show('home', true);
    $('#runAnnouncement').textContent = logged ? `${meals[logged].name} logged. ${fmt(2329 - 460 - meals[logged].kcal)} calories left.` : 'Dinner removed. 1,869 calories left.';
    $('#runHomeTab').focus({ preventScroll: true });
  }
  $('#logDinner').addEventListener('click', () => finishLog());
  $('#undoDinner').addEventListener('click', () => finishLog(true));
  draw();
  const render=p=>{if(!manual){const next=p>=.8?'pick':'home';if(screen!==next)show(next);}};
  render.resume=()=>{manual=false;logged=null;selected='D';draw();};
  return render;
}


/* CHAPTER CONTROLLER */
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
const scan=phoneFlow(), coach=saraScene(), plan=dayScene(), health=runnerPhoneScene();
const renderers={scan,coach,health:p=>{
 health(p);
 // The same component order as v2's home entrance, scrubbed by chapter progress.
 if(!document.querySelector('[data-demo="health"]').dataset.manual){
  const n=eOut(seg(p,0,.24));
  $('#gLeft').textContent=fmt(1869*n);$('#gCons').textContent=fmt(460*n);
  $('#gArc').setAttribute('stroke-dasharray',`${1869/2329*100*n} 100`);
  $$('#home .week span,#home .act>div').forEach((item,i)=>{
   const a=eOut(seg(p,.01+i*.008,.1+i*.008));item.style.opacity=a;item.style.transform=`translateY(${(1-a)*14}px)`;
  });
 }
},plan:p=>{
 plan.set(0,p>.35?1:0,p>.8);plan.set(1,p>.5?1:0,p>.85);plan.set(2,p>.65?1:0,p>.9);
},widgets:p=>{
 $$('#wgs .wg').forEach((w,i)=>{const v=seg(p,.02+i*.13,.22+i*.13);w.style.opacity=.12+.88*v;w.style.transform=`translateY(${(1-eOut(v))*32}px)`});
 $$('#wgs .mm i').forEach((bar,i)=>{bar.style.transform=`scaleX(${eOut(seg(p,.14+i*.08,.4+i*.08))})`;bar.style.transformOrigin='left'});
 const line=$('#wgs .wg.m path:nth-of-type(2)'),L=line.getTotalLength();line.style.strokeDasharray=L;line.style.strokeDashoffset=L*(1-seg(p,.5,.85));
}};
let fastingHours=16;
renderers.fasting=function(p){
 const host=$('#fastingDevice');if(!host)return;
 const elapsed=fastingHours*seg(p,.08,.82),done=p>=.82;
 const minutes=Math.round(elapsed*60),endHour=20+fastingHours-24;
 const endText=(endHour===12?12:endHour%12)+':00 '+(endHour>=12?'PM':'AM');
 $('[data-fasting-time]',host).textContent=String(Math.floor(minutes/60)).padStart(2,'0')+':'+String(minutes%60).padStart(2,'0');
 $('[data-fasting-goal]',host).textContent='of '+fastingHours+' hours';
 $('[data-fasting-state]',host).textContent=done?'Eating window':'Fasting window';
 $('[data-fasting-end]',host).textContent=endText+' – 8:00 PM';
 $('[data-fasting-next]',host).textContent=done?'Your eating window is open':'Your eating window opens at '+endText;
 $('.df-fasting-arc',host).style.strokeDashoffset=1-seg(p,.08,.82);
 $('.df-fasting-timeline span',host).style.width=(fastingHours/24*100)+'%';
 $('.df-fasting-timeline i',host).style.transform='translateX('+((done?fastingHours+(24-fastingHours)*seg(p,.82,1):elapsed)/24*299).toFixed(2)+'px)';
 host.classList.toggle('is-eating',done);
};
$$('[data-fasting-hours]').forEach(button=>button.addEventListener('click',()=>{
 fastingHours=Number(button.dataset.fastingHours);
 $$('[data-fasting-hours]').forEach(el=>el.setAttribute('aria-pressed',String(el===button)));
 const section=button.closest('[data-demo]');renderers.fasting(Number(section.dataset.demoProgress)||0);
}));
const chapters=$$('[data-demo]');
function fit(el){
  const stage=$('.df-feature-stage',el),device=$('.dv',el);
  const native=$('.df-native',el),mascot=$('.df-feature-peek.df-mascot',el);
  const sharedPhoneColumn=document.body.classList.contains('dietfit-home--en');
  const availableWidth=Math.max(1,sharedPhoneColumn?stage.clientWidth:(mascot?native.clientWidth:stage.clientWidth));
  const maxScale=sharedPhoneColumn?Math.max(1.15,Math.min(2,1.15+(window.innerWidth-1440)*.000535714)):1.15;
  if(el.dataset.demo==='widgets'){
    const board=$('#wgs',el);
    if(mascot){
      board.style.width='460px';
      const k=Math.min(sharedPhoneColumn?maxScale:1,availableWidth/460,Math.max(1,stage.clientHeight-24)/board.offsetHeight);
      board.style.transform=`scale(${k})`;
      if(sharedPhoneColumn)stage.style.setProperty('--df-feature-visual-width',`${460*k}px`);
      stage.style.setProperty('--df-mascot-floor',`${(stage.clientHeight-board.offsetHeight*k)/2}px`);
    }else{
      native.style.width='460px';
      native.style.transform=`scale(${Math.min(1,availableWidth/board.offsetWidth,Math.max(1,stage.clientHeight-24)/board.offsetHeight)})`;
    }
    return;
  }
  if(!device)return;
  const k=Math.max(.1,Math.min(stage.clientHeight/832,(availableWidth-12)/395,maxScale));
  device.style.setProperty('--k',k.toFixed(4));
  if(sharedPhoneColumn)stage.style.setProperty('--df-feature-visual-width',`${395*k}px`);
  if(mascot)stage.style.setProperty('--df-mascot-floor',`${(stage.clientHeight-832*k)/2}px`);
}
function draw(el,p){
 p=clamp(p);el.style.setProperty('--demo-p',p);el.dataset.demoProgress=p.toFixed(3);renderers[el.dataset.demo](p);
}
chapters.forEach(el=>{
 fit(el);new ResizeObserver(()=>{fit(el);schedule()}).observe($('.df-feature-stage',el));
 const seek=p=>{el.dataset.manual='true';$('.df-resume',el).hidden=false;if(el.dataset.demo==='health'){$('#gLeft').textContent='1,869';$('#gCons').textContent='460';$('#gArc').setAttribute('stroke-dasharray','80.25 100');$$('#home .week span,#home .act>div').forEach(e=>{e.style.opacity=1;e.style.transform='none'})}draw(el,p)};
 $('.df-resume',el).addEventListener('click',()=>{if(el.dataset.demo==='plan')plan.resume();if(el.dataset.demo==='health')health.resume();delete el.dataset.manual;$('.df-resume',el).hidden=true;schedule()});
 $('.df-native',el).addEventListener('pointerdown',event=>{if(!event.target.closest('button,input,[role=tab]'))return;el.dataset.manual='true';$('.df-resume',el).hidden=false},{capture:true});
 $('.df-native',el).addEventListener('focusin',()=>{el.dataset.manual='true';$('.df-resume',el).hidden=false});
 if(el.dataset.demo==='scan'){
  const actions=[['#shut','Capture meal',.23],['#a-ana .bt','Review ingredients',.55],['#a-lst .bt:not(.l)','Calculate nutrition',.86],['#a-md .stick .bt','Log sample meal',.98]];
  actions.forEach(([selector,label,p])=>{const old=$(selector,el),b=document.createElement('button');b.className=old.className;b.id=old.id;b.type='button';b.innerHTML=old.innerHTML;b.setAttribute('aria-label',label);old.replaceWith(b);b.addEventListener('click',()=>{seek(p);if(p===.98)b.textContent='Logged in demo ✓'})});
 }
});
let raf=0;function render(){raf=0;for(const el of chapters){const box=el.getBoundingClientRect();el.classList.toggle('is-past',box.bottom<=104);if(el.dataset.manual)continue;if(box.bottom<0||box.top>innerHeight)continue;const sticky=$('.df-feature-sticky',el),small=matchMedia('(max-width:700px)').matches,top=small?88:parseFloat(getComputedStyle(sticky).top)||80,copyOffset=small?$('.df-feature-copy',el).offsetHeight+56:0,viewHeight=small?innerHeight-112:sticky.offsetHeight;draw(el,reduce.matches?({scan:.88,coach:.8,plan:.22,health:.2,widgets:1,fasting:.55}[el.dataset.demo]):clamp((top-box.top-copyOffset)/Math.max(1,el.offsetHeight-viewHeight-copyOffset)));}}
function schedule(){if(!raf)raf=requestAnimationFrame(render)}
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});reduce.addEventListener('change',schedule);
document.fonts.ready.then(()=>chapters.forEach(fit));
chapters.forEach(el=>draw(el,reduce.matches?({scan:.88,coach:.8,plan:.22,health:.2,widgets:1,fasting:.55}[el.dataset.demo]):0));schedule();
// Native hash navigation can precede the original v1 carousel's final measurement.
// Align once after fonts/load, and always yield to the visitor's input.
if(/^#dietfit-(product|scan|sara|plan|activity|widgets|fasting)$/.test(location.hash)){
 const initialHash=location.hash;let navigated=false;
 ['wheel','touchstart','keydown','pointerdown'].forEach(type=>addEventListener(type,()=>{navigated=true},{once:true,passive:true}));
 const align=()=>document.fonts.ready.then(()=>requestAnimationFrame(()=>{
  if(navigated||location.hash!==initialHash)return;
  const target=document.querySelector(initialHash);
  if(window.dietfitLenis){window.dietfitLenis.resize();window.dietfitLenis.scrollTo(target,{immediate:true,offset:matchMedia('(max-width:700px)').matches?-72:initialHash==='#dietfit-product'?-96:0})}else target.scrollIntoView();
  schedule();
 }));
 if(document.readyState==='complete')align();else addEventListener('load',align,{once:true});
}
})();
