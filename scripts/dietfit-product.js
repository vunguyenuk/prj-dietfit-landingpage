/* Browser-local product demonstrations, adapted from landing v2 and the supplied
   iOS recordings. These are sample data, not an AI service or a saved food log. */
(() => {
  'use strict';
  const root = document.querySelector('.dietfit-product');
  if (!root) return;
  const en = document.documentElement.lang.startsWith('en');
  const $ = s => root.querySelector(s);
  const $$ = s => [...root.querySelectorAll(s)];
  const t = (vi, english) => en ? english : vi;
  const fmt = n => new Intl.NumberFormat(en ? 'en-US' : 'vi-VN').format(Math.round(n));
  const food = [
    {name:t('Cơm nếp cẩm','Black sticky rice'), grams:150, kcal:240, protein:5, carbs:46, fat:4},
    {name:t('Tôm hấp','Steamed shrimp'), grams:75, kcal:65, protein:16, carbs:0, fat:.5},
    {name:t('Lòng trắng trứng','Egg white'), grams:65, kcal:35, protein:7, carbs:0, fat:0},
    {name:t('Bí ngòi cắt lát','Sliced zucchini'), grams:100, kcal:18, protein:0, carbs:4, fat:.5}
  ];
  const quantities = food.map(f => f.grams);
  const stageButtons = $$('[data-scan-stage]');
  let scanState = 'capture', selectedFood = -1;
  const totals = () => food.reduce((sum,f,i) => {
    for (const k of ['kcal','protein','carbs','fat']) sum[k] += f[k] * quantities[i] / f.grams;
    return sum;
  },{kcal:0,protein:0,carbs:0,fat:0});
  function updateNutrition() {
    const sums = totals();
    for (const k of Object.keys(sums)) $$(`[data-total="${k}"]`).forEach(el => { el.textContent = fmt(sums[k]); });
    $$('[data-food]').forEach(el => {
      const i = +el.dataset.food, f = food[i];
      el.querySelector('[data-food-calories]').textContent = fmt(f.kcal * quantities[i] / f.grams);
      el.setAttribute('aria-label',`${f.name}, ${fmt(f.kcal * quantities[i] / f.grams)} kcal`);
    });
    $('#df-scan-save-status').textContent = '';
    $('#df-save-meal').textContent = t('Lưu bữa ăn →','Save meal →');
    if(selectedFood >= 0) $('#df-selected-food').textContent = `${food[selectedFood].name} · ${quantities[selectedFood]} g`;
  }
  function showScan(state) {
    scanState = state;
    $('#df-scan-app').dataset.state = state;
    $$('[data-scan-view]').forEach(view => { view.hidden = view.dataset.scanView !== state; });
    $('#df-scan-photo').hidden = state === 'edit';
    stageButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.scanStage === state)));
    $('#df-scan-help').hidden = true;
    $('#df-scan-help-button').setAttribute('aria-expanded','false');
    updateNutrition();
    $('#df-product-status').textContent = {
      capture:t('Camera minh hoạ. Bấm nút chụp để xem kết quả Deep Scan.','Sample camera. Press the shutter to see the Deep Scan result.'),
      identify:t('Đã nhận diện 4 nguyên liệu. Chọn một nhãn để kiểm tra.','Four ingredients identified. Choose a label to inspect it.'),
      edit:t('Chỉnh khối lượng nguyên liệu để cập nhật calo và macro.','Edit ingredient weights to update calories and macros.')
    }[state];
  }
  const scanChapter = $('#dietfit-scan');
  const takeScanControl = event => {
    if(event.target.closest('button,input')) {
      scanChapter.dataset.scanManual = 'true';
      const index = scanChapter.querySelector('.df-scroll-status');
      if(index) index.textContent = t('Bạn điều khiển','Your turn');
    }
  };
  scanChapter.addEventListener('pointerdown', takeScanControl);
  scanChapter.addEventListener('click', takeScanControl, true);
  scanChapter.addEventListener('keydown', takeScanControl);
  scanChapter.addEventListener('focusin', takeScanControl);
  scanChapter.addEventListener('input', takeScanControl, true);
  scanChapter.addEventListener('dietfit:scan-step', event => {
    if(scanChapter.dataset.scanManual !== 'true' && ['capture','identify','edit'].includes(event.detail) && scanState !== event.detail) showScan(event.detail);
  });
  stageButtons.forEach(button => button.addEventListener('click',() => {
    showScan(button.dataset.scanStage);
    if(matchMedia('(max-width: 767px)').matches) {
      $('#df-scan-app').closest('.df-phone').scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    }
  }));
  $('#df-shutter').addEventListener('click',() => showScan('identify'));
  $('#df-scan-next').addEventListener('click',() => showScan('edit'));
  $$('[data-scan-reset]').forEach(button => button.addEventListener('click',() => {
    food.forEach((f,i) => { quantities[i] = f.grams; $(`[data-food-input="${i}"]`).value = f.grams; });
    selectedFood = -1;
    $$('[data-food]').forEach(label => label.setAttribute('aria-pressed','false'));
    $$('.df-ingredient-outlines [data-region]').forEach(region => { region.style.removeProperty('fill-opacity'); region.style.removeProperty('stroke-width'); });
    $('#df-selected-food').textContent = t('4 nguyên liệu · chọn nhãn để xem','4 ingredients · tap a label');
    showScan('capture');
  }));
  $('#df-scan-help-button').addEventListener('click',() => {
    const hint = $('#df-scan-help'); hint.hidden = !hint.hidden;
    $('#df-scan-help-button').setAttribute('aria-expanded',String(!hint.hidden));
  });
  $$('[data-food]').forEach(button => button.addEventListener('click',() => {
    selectedFood = +button.dataset.food;
    $$('[data-food]').forEach(label => label.setAttribute('aria-pressed',String(label === button)));
    $('#df-selected-food').textContent = `${food[selectedFood].name} · ${quantities[selectedFood]} g`;
    $$('.df-ingredient-outlines [data-region]').forEach(region => {
      region.style.fillOpacity = +region.dataset.region === selectedFood ? '.28' : '.04';
      region.style.strokeWidth = +region.dataset.region === selectedFood ? '2.5' : '1.4';
    });
  }));
  $$('[data-food-input]').forEach(input => input.addEventListener('input',() => {
    const i = +input.dataset.foodInput, parsed = input.valueAsNumber;
    if (!Number.isFinite(parsed)) return;
    quantities[i] = Math.max(0,Math.min(500,parsed));
    if (parsed !== quantities[i]) input.value = quantities[i];
    updateNutrition();
  }));
  $('#df-save-meal').addEventListener('click',() => {
    $('#df-save-meal').textContent = t('Đã lưu trong bản demo ✓','Saved in this demo ✓');
    $('#df-scan-save-status').textContent = t(`Bữa ăn ${fmt(totals().kcal)} kcal đã được ghi nhận trong bản demo.`,`Your ${fmt(totals().kcal)} kcal meal has been logged in this demo.`);
  });

  // Guided, fixed conversations: no typed prompt is sent to any service.
  const conversations = [
    {
      question:t('Cho mình xem tổng kết hôm nay.','Show me some stats today.'),
      answer:t('Đây là tổng kết hôm nay của bạn: 460 kcal đã ăn trên mục tiêu 2.329 kcal. Bạn đi được 7.698 bước, chạy 1 giờ 24 phút và ngủ 7 giờ 16 phút tối qua.','Here is your day so far: 460 kcal eaten toward a 2,329 kcal goal, 7,698 steps, an 84-minute run, and 7 hours 16 minutes of sleep last night.'),
      labels:[t('Đã ăn','Eaten'),t('Bước chân','Steps'),t('Vận động','Activity'),t('Giấc ngủ','Sleep')],
      values:['460 kcal','7,698','1h 24m','7h 16m']
    },
    {
      question:t('Bữa ăn này có gì nổi bật?','Is this food healthy?'),
      answer:t('Cá hồi sashimi cung cấp protein và chất béo. Sara đặt nhận xét về món ăn bên cạnh mục tiêu và dữ liệu bạn đã chia sẻ, để bạn có thêm ngữ cảnh khi chọn bữa tiếp theo.','Salmon sashimi provides protein and fats. Sara puts meal guidance beside the goal and log you have shared, giving the next food choice more context.'),
      labels:[t('Đang xem','Looking at'),t('Dữ liệu đi kèm','With context')],
      values:[t('Bữa cá hồi','Salmon meal'),t('Mục tiêu & nhật ký','Goal & food log')]
    },
    {
      question:t('Giấc ngủ của mình thế nào?','Well, how’s my sleep?'),
      answer:t('Tối qua bạn ngủ 7 giờ 16 phút. Trong hội thoại này, Sara xem giấc ngủ cùng hoạt động và bữa ăn đã ghi nhận, thay vì chỉ trả lời một câu hỏi tách rời.','You logged 7 hours 16 minutes of sleep last night. In this conversation, Sara looks at sleep alongside the activity and meals you have logged, rather than treating the question in isolation.'),
      labels:[t('Tối qua','Last night'),t('Nguồn dữ liệu','Data source')],
      values:['7h 16m',t('Ứng dụng sức khỏe','Connected health app')]
    }
  ];
  function showConversation(index) {
    const c = conversations[index];
    $('#df-chat-question').textContent = c.question;
    $('#df-chat-answer').textContent = c.answer;
    const stats = $('#df-chat-stats'); stats.replaceChildren();
    c.labels.forEach((label,i) => {
      const div = document.createElement('div'), b = document.createElement('b'), span = document.createElement('span');
      b.textContent = c.values[i]; span.textContent = label; div.append(b,span); stats.append(div);
    });
    $$('[data-chat-choice]').forEach(button => button.setAttribute('aria-pressed',String(+button.dataset.chatChoice === index)));
    $$('[data-sara-stage]').forEach(button => button.setAttribute('aria-pressed',String(+button.dataset.saraStage === index)));
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const entrance = (element,delay,distance) => {
        if(!element.animate) return;
        element.getAnimations?.().forEach(animation => animation.cancel());
        element.animate([{opacity:.15,transform:`translateY(${distance}px)`},{opacity:1,transform:'translateY(0)'}],{duration:360,delay,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'});
      };
      entrance($('#df-chat-question'),0,12);
      entrance($('.df-chat-bubble'),100,20);
      entrance(stats,220,10);
    }
  }
  $$('[data-chat-choice]').forEach(button => button.addEventListener('click',() => showConversation(+button.dataset.chatChoice)));
  $$('[data-sara-stage]').forEach(button => button.addEventListener('click',() => showConversation(+button.dataset.saraStage)));
  $('#dietfit-sara').addEventListener('dietfit:coach-choice',event => {
    if($('#dietfit-sara').dataset.uiManual !== 'true' && Number.isInteger(event.detail) && event.detail>=0 && event.detail<conversations.length) showConversation(event.detail);
  });

  const mealOptions = [
    [{id:'E',name:t('Taco ba vị','Street tacos, three ways'),kcal:430,n:5},{id:'A',name:t('Bò bít tết và trứng','Brunch plate with eggs & steak'),kcal:800,n:6}],
    [{id:'P',name:t('Tôm và cơm nếp cẩm','Shrimp & black sticky rice'),kcal:358,n:4},{id:'C',name:t('Mì ramen chashu','Miso ramen with chashu'),kcal:690,n:7}],
    [{id:'D',name:t('Gà và thịt cừu nướng','Chicken & lamb kabob plate'),kcal:685,n:6},{id:'B',name:t('Cơm tấm sườn nướng','Grilled pork chop & broken rice'),kcal:680,n:7}]
  ];
  const meals = mealOptions.map(() => ({option:0,logged:false}));
  function updatePlan(announce = false) {
    let planned = 0, logged = 0;
    meals.forEach((state,i) => {
      const meal = mealOptions[i][state.option], row = $(`[data-meal-slot="${i}"]`);
      planned += meal.kcal; if(state.logged) logged += meal.kcal;
      row.querySelector('img').src = `/assets/product/meals/${meal.id}-photo.jpg`;
      row.querySelector('img').alt = meal.name;
      row.querySelector('h4').textContent = meal.name;
      row.querySelector('[data-meal-kcal]').textContent = `${meal.kcal} kcal`;
      row.querySelector('small').textContent = t(`${meal.n} nguyên liệu · Deep Scan`,`${meal.n} ingredients · Deep Scan`);
      const button = row.querySelector('[data-meal-log]');
      button.textContent = state.logged ? '✓' : '+';
      button.setAttribute('aria-pressed',String(state.logged));
      button.setAttribute('aria-label',t(`${state.logged?'Bỏ ghi nhận':'Ghi nhận'} ${meal.name}`,`${state.logged?'Unlog':'Log'} ${meal.name}`));
    });
    $('#df-plan-total').textContent = `${fmt(planned)} kcal`;
    $$('[data-plan-sum]').forEach(node => { node.textContent = `${fmt(planned)} kcal`; });
    $$('[data-meal-mirror]').forEach(mirror => {
      const i=+mirror.dataset.mealMirror, meal=mealOptions[i][meals[i].option];
      mirror.querySelector('img').src=`/assets/product/meals/${meal.id}-photo.jpg`;
      mirror.querySelector('strong').textContent=meal.name;
      mirror.querySelector('small').textContent=`${meal.kcal} kcal`;
    });
    $('#df-plan-logged').textContent = t(`Đã ghi nhận ${fmt(logged)} kcal trong bản demo.`,`${fmt(logged)} kcal logged in this demo.`);
    if(announce) $('#df-product-status').textContent = $('#df-plan-logged').textContent;
  }
  $$('[data-meal-swap]').forEach(button => button.addEventListener('click',() => {
    const i = +button.closest('[data-meal-slot]').dataset.mealSlot;
    meals[i].option = 1 - meals[i].option; meals[i].logged = false; updatePlan(true);
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      $(`[data-meal-slot="${i}"] .df-meal-card`).animate?.([{opacity:.35,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:280,easing:'cubic-bezier(.22,1,.36,1)'});
    }
  }));
  $$('[data-meal-log]').forEach(button => button.addEventListener('click',() => {
    const i = +button.closest('[data-meal-slot]').dataset.mealSlot;
    meals[i].logged = !meals[i].logged; updatePlan(true);
  }));

  const charts = {
    week: {points:'0,30 65,48 130,42 195,70 260,64 325,91 390,100',value:'71.8',start:t('7 ngày trước','7 days ago')},
    month: {points:'0,14 35,22 70,15 105,42 140,35 175,58 210,48 245,62 280,85 315,78 350,95 390,100',value:'71.8',start:t('30 ngày trước','30 days ago')}
  };
  $$('[data-chart-range]').forEach(button => button.addEventListener('click',() => {
    const range = button.dataset.chartRange, c = charts[range];
    $('#df-chart-line').setAttribute('points',c.points);
    $('#df-chart-start').textContent = c.start;
    $('#df-progress-svg').setAttribute('aria-label',t(`Xu hướng cân nặng minh hoạ ${range==='week'?'7':'30'} ngày, kết thúc 71,8 kg.`,`Illustrative ${range==='week'?'7':'30'}-day weight trend, ending at 71.8 kg.`));
    $$('[data-chart-range]').forEach(el => el.setAttribute('aria-pressed',String(el===button)));
  }));
  let habitLogged = false;
  $('#df-habit-log').addEventListener('click',() => {
    habitLogged = !habitLogged;
    $('#df-streak-count').textContent = habitLogged ? '7' : '6';
    $('#df-streak-today').classList.toggle('is-complete',habitLogged);
    $('#df-streak-today b').textContent = habitLogged ? '✓' : '+';
    $('#df-habit-log').textContent = habitLogged ? t('Đã log hôm nay ✓ · Làm lại','Logged today ✓ · Reset') : t('Log thử bữa hôm nay →','Try logging today’s meal →');
    $('#df-habit-log').setAttribute('aria-pressed',String(habitLogged));
    $('#df-habit-reward').textContent = habitLogged ? t('Hoàn thành · nhận Fitpoints','Complete · earn Fitpoints') : t('Thử thách: log bữa hôm nay','Challenge: log today’s meal');
    $('#df-product-status').textContent = t(`Streak minh hoạ: ${habitLogged?7:6} ngày.`,`Sample streak: ${habitLogged?7:6} days.`);
  });

  // Native controls retain pause, seek and keyboard access. Only one recording
  // plays at a time, and recordings load on request rather than at page entry.
  const videos = $$('video[data-product-recording]');
  videos.forEach(video => video.addEventListener('play',() => videos.forEach(other => { if(other!==video) other.pause(); })));
  if('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if(!entry.isIntersecting) entry.target.pause(); }),{threshold:.05});
    videos.forEach(video => observer.observe(video));
  }
  showScan(scanState); showConversation(0); updatePlan();
})();
