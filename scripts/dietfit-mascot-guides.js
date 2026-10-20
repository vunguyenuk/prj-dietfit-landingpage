/* A light narrative layer: observe the existing app state, never own its timeline. */
(() => {
  'use strict';
  const language=document.documentElement.lang==='en'?'en':'vi';
  const copy={
    vi:{
      scan:{intro:['Cùng Sara xem bữa ăn','Bạn chụp một bữa. Cùng xem từng nguyên liệu nhé.'],identify:['Nhìn gần hơn một chút','Từng nguyên liệu đang hiện trên ảnh. Bạn có nhận ra món quen không?'],review:['Bạn hiểu bữa ăn của mình nhất','Kiểm tra lại các nguyên liệu trước khi ghi nhận nhé.'],ready:['Từ bức ảnh đến bữa ăn','Đã có calo và macro. Cùng nhìn lại bữa ăn vừa chụp.']},
      plan:{intro:['Một kế hoạch dành cho bạn','Chọn món hợp khẩu vị. Ghi lại khi bạn đã ăn.'],swapped:['Chưa hợp? Mình đổi món nhé.','Kế hoạch vẫn theo mục tiêu, nhưng có chỗ cho khẩu vị của bạn.'],logged:['Đã ghi nhận trong demo','Thêm một bữa trong nhật ký. Cứ từng bữa một thôi.']},
      widgets:{intro:['Đều đặn, từng ngày một','Mỗi bữa được ghi lại là thêm một bước nhỏ.'],streak:['12 ngày được ghi lại','Một chuỗi ngày đều đặn, được nhắc nhớ ngay trên Home Screen.'],trend:['Nhìn lại để bước tiếp','Nhật ký giúp bạn thấy xu hướng và hiểu thói quen của mình hơn.']}
    },
    en:{
      scan:{intro:['A closer look with Sara','One meal photo. Let’s look at the ingredients together.'],identify:['A little closer','Ingredients are appearing on the photo. Recognise your favourites?'],review:['You know your meal best','Review the ingredients before adding the meal to your log.'],ready:['From photo to understanding','Calories and macros are ready. Take another look at your meal.']},
      plan:{intro:['Make the plan yours','Pick what you enjoy. Log it once you’ve eaten.'],swapped:['Not your favourite? Swap it.','Your goal still guides the plan. There’s room for your taste, too.'],logged:['Logged in this demo','Another meal in your diary. One meal at a time.']},
      widgets:{intro:['One day at a time','Every meal you log is another small step.'],streak:['12 days of showing up','A little reminder of your consistency, right on the Home Screen.'],trend:['Look back, move forward','Your diary helps you see trends and understand your habits.']}
    }
  };
  const initialMeals=[...document.querySelectorAll('#slots .mrow b')].map(el=>el.textContent);
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const guides=[...document.querySelectorAll('[data-mascot-guide]')].map(guide=>({
    guide,kind:guide.dataset.mascotGuide,chapter:guide.closest('[data-demo]'),
    phone:guide.querySelector('.df-guide-pose--phone'),happy:guide.querySelector('.df-guide-pose--happy'),
    label:guide.querySelector('.df-guide-label'),caption:guide.querySelector('[data-guide-caption]')
  }));
  if(!guides.length)return;
  const setText=(el,value)=>{if(el.textContent!==value)el.textContent=value;};
  function update(){
    queued=false;
    for(const item of guides){
      const {guide,kind,chapter,phone,happy,label,caption}=item;
      const p=Number(chapter.dataset.demoProgress)||0;
      let state='intro';
      if(kind==='scan')state=p>=.76?'ready':p>=.47?'review':p>=.25?'identify':'intro';
      if(kind==='plan'){
        const logged=Number(document.getElementById('planTick')?.textContent)||0;
        const changed=[...document.querySelectorAll('#slots .mrow b')].some((meal,i)=>meal.textContent!==initialMeals[i]);
        state=logged>0?'logged':changed?'swapped':'intro';
      }
      if(kind==='widgets')state=p>=.72?'trend':p>=.35?'streak':'intro';
      // State changes trigger a single acknowledgement; ordinary scroll never loops an animation.
      if(guide.dataset.guideState!==state)guide.dataset.guideState=state;
      const text=copy[language][kind][state];setText(label,text[0]);setText(caption,text[1]);
      const usePhone=kind==='scan'&&state!=='ready';phone.hidden=!usePhone;happy.hidden=usePhone;
      const enter=motion.matches?1:Math.min(1,Math.max(0,p/.16));
      guide.style.setProperty('--guide-enter',String(enter));
      guide.style.setProperty('--guide-turn',String(motion.matches?0:kind==='scan'?-4*(1-enter):0));
    }
  }
  let queued=false;
  function schedule(){if(!queued){queued=true;requestAnimationFrame(update);}}
  const observer=new MutationObserver(schedule);
  guides.forEach(({chapter})=>observer.observe(chapter,{attributes:true,attributeFilter:['data-demo-progress']}));
  const slots=document.getElementById('slots');
  if(slots)observer.observe(slots,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  motion.addEventListener('change',schedule);
  update();
})();
