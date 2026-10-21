/* Build the EN hero from original Rive exports, replacing only embedded image bytes.
   Timeline/state-machine objects, VI exports and their image metadata stay untouched.
   Dependencies: @napi-rs/canvas and sharp (normal npm modules, no network at build time). */
const fs=require('node:fs'),path=require('node:path');
const dependencies=process.env.DIETFIT_NODE_MODULES;
const dep=name=>require(dependencies?path.join(dependencies,name):name);
const {createCanvas,loadImage,GlobalFonts}=dep('@napi-rs/canvas'),sharp=dep('sharp');
const root=path.resolve(__dirname,'..'),dir=path.join(root,'assets/hero/us-en');
for(const weight of [400,500,600,700])GlobalFonts.registerFromPath(path.join(root,`assets/fonts/be-vietnam-pro-${weight}.woff2`),'Dietfit');
const C={ink:'#161616',muted:'#737373',line:'#e9e9e9',orange:'#ff692b',green:'#1b9a55'};
function surface(w,h){const canvas=createCanvas(w,h),c=canvas.getContext('2d');c.textBaseline='top';return {canvas,c,w,h};}
function rect(o,x,y,w,h,r=0,fill='#fff',stroke){const c=o.c;c.beginPath();c.roundRect(x,y,w,h,r);if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.strokeStyle=stroke;c.lineWidth=1;c.stroke()}}
function text(o,t,x,y,size=16,color=C.ink,weight=400){const c=o.c;c.font=`${weight} ${size}px Dietfit`;c.fillStyle=color;c.fillText(t,x,y)}
function centeredText(o,t,cx,y,size=16,color=C.ink,weight=400){const c=o.c;c.font=`${weight} ${size}px Dietfit`;text(o,t,cx-c.measureText(t).width/2,y,size,color,weight)}
function streakFlame(o,x,y,size){const c=o.c;c.save();c.translate(x,y);c.scale(size/48,size/48);c.beginPath();c.moveTo(28,1);c.bezierCurveTo(15,8,23,16,13,22);c.bezierCurveTo(10,18,11,14,11,14);c.bezierCurveTo(-1,31,9,47,24,47);c.bezierCurveTo(42,47,49,29,37,17);c.bezierCurveTo(39,28,31,29,32,18);c.bezierCurveTo(32,11,25,9,28,1);c.fillStyle=C.orange;c.fill();c.beginPath();c.moveTo(25,22);c.bezierCurveTo(25,29,18,30,18,36);c.bezierCurveTo(18,46,33,45,33,36);c.bezierCurveTo(33,31,29,29,29,27);c.bezierCurveTo(29,33,24,34,25,22);c.fillStyle='#ffc747';c.fill();c.restore()}
function line(o,x1,y1,x2,y2,color=C.line,width=1){const c=o.c;c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.strokeStyle=color;c.lineWidth=width;c.stroke()}
function circle(o,x,y,r,fill,stroke){const c=o.c;c.beginPath();c.arc(x,y,r,0,Math.PI*2);if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.strokeStyle=stroke;c.lineWidth=1;c.stroke()}}
function paragraph(o,t,x,y,width,size=15,leading=22,color=C.muted){const c=o.c;c.font=`400 ${size}px Dietfit`;let row='',dy=y;for(const word of t.split(' ')){if(c.measureText(row+word).width>width){text(o,row.trim(),x,dy,size,color);row='';dy+=leading}row+=word+' '}if(row)text(o,row.trim(),x,dy,size,color);return dy+leading}
function card(w,h){const o=surface(w,h);rect(o,1,1,w-2,h-2,24,'#fff','#e1e1e1');return o}
function info(o,x,y,color=C.ink){circle(o,x,y,7,null,color);text(o,'i',x-1.5,y-5.4,10,color)}
function flame(o,x,y,size=24){const c=o.c;c.save();c.translate(x,y);c.scale(size/28,size/28);c.beginPath();c.moveTo(14,1);c.bezierCurveTo(14,8,23,10,23,18);c.bezierCurveTo(23,31,4,31,4,18);c.bezierCurveTo(4,13,8,10,10,8);c.bezierCurveTo(10,14,14,16,14,1);c.fillStyle=C.orange;c.fill();c.restore()}
function save(name,o){fs.writeFileSync(path.join(dir,name+'.png'),o.canvas.toBuffer('image/png'));}
function status(o,dark=false){const col=dark?'#fff':C.ink;text(o,'9:41',58,20,17,col,600);for(let i=0;i<4;i++)rect(o,302+i*5,28-i*2,3,5+i*2,1,col);line(o,329,25,342,25,col,3);rect(o,354,23,23,12,3,null,col);rect(o,357,26,16,6,1,col)}
function cross(o,x,y,color=C.ink){line(o,x-5,y-5,x+5,y+5,color,1.5);line(o,x+5,y-5,x-5,y+5,color,1.5)}
function arc(o,x,y,r,start,end,color,width){const c=o.c;c.beginPath();c.arc(x,y,r,start,end);c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.stroke()}
async function main(){
 const hand=await loadImage(path.join(dir,'meal-hand-source.png'));
 // Match the original Rive plate anchor (about 920, 670) without changing the
 // timeline. Only the forearm is sheared to keep its entry attached to the top.
 const placed=surface(1536,1055),pc=placed.c;
 const plate={cx:922,cy:670,rx:335,ry:342};
 // Directional cast shadow and a tighter contact shadow sit behind the bowl.
 for(const [dx,dy,blur,alpha]of [[15,20,15,.30],[5,8,4,.24]]){
  pc.save();pc.filter=`blur(${blur}px)`;pc.fillStyle=`rgba(20,25,15,${alpha})`;pc.beginPath();pc.ellipse(plate.cx+dx,plate.cy+dy,plate.rx,plate.ry,0,0,Math.PI*2);pc.fill();pc.restore();
 }
 const scale=.97,dx=78,dy=80,joint=300,seam=joint*scale+dy;
 pc.save();pc.beginPath();pc.rect(0,0,1536,seam);pc.clip();pc.transform(scale,0,dx/joint,seam/joint,0,0);pc.drawImage(hand,0,0);pc.restore();
 pc.save();pc.beginPath();pc.rect(0,seam,1536,1055-seam);pc.clip();pc.transform(scale,0,0,scale,dx,dy);pc.drawImage(hand,0,0);pc.restore();
 await sharp(placed.canvas.toBuffer('image/png')).webp({quality:90,alphaQuality:100}).toFile(path.join(dir,'hands.webp'));
 await sharp(path.join(dir,'table-bench-clean.png')).resize(1448,1086,{fit:'cover',position:'centre'}).webp({quality:88}).toFile(path.join(dir,'bg.webp'));
 const foodHand=await loadImage(await sharp(path.join(dir,'meal-hand-source.png')).resize(1536,1055,{fit:'fill'}).webp({quality:90,alphaQuality:100}).toBuffer());
 const table=await loadImage(await sharp(path.join(dir,'table-source.png')).resize(1448,1086,{fit:'cover',position:'centre'}).webp({quality:88}).toBuffer());
 // Shared food image crop: the same exact plate appears in the hand, result and thumbnail.
 function foodCrop(o,x,y,w,h){const c=o.c;c.drawImage(foodHand,525,250,710,710,x,y,w,h)}
 let o=surface(413,416);foodCrop(o,0,0,413,416);let g=o.c.createLinearGradient(0,300,0,416);g.addColorStop(0,'#ffffff00');g.addColorStop(1,'#ffffffff');o.c.fillStyle=g;o.c.fillRect(0,300,413,116);status(o,true);circle(o,43,89,20,'#ffffff55');text(o,'‹',33,72,29);circle(o,370,89,20,'#ffffff55');text(o,'⋮',366,73,25);save('food',o);await sharp(path.join(dir,'food.png')).webp({quality:92,alphaQuality:100}).toFile(path.join(dir,'food.webp'));fs.unlinkSync(path.join(dir,'food.png'));
 // Main meal result: same 404 x 1311 layout and information density as the original.
 o=surface(404,1311);rect(o,1,1,402,348,24,'#fff','#e4e4e4');rect(o,22,22,86,29,16,'#f5f5f5');text(o,'12:30 PM',32,28,13);text(o,'Roast veggie bowl',22,76,18,C.ink,600);circle(o,280,86,13,'#f5f5f5');text(o,'−',274,77,17);text(o,'1',318,77,18,C.ink,500);circle(o,368,86,13,'#f5f5f5');text(o,'+',362,77,17);rect(o,22,126,360,88,18,'#fff',C.line);flame(o,125,151,28);text(o,'620',164,147,38,C.ink,600);text(o,'kcal',252,162,16,C.muted);
 for(const [i,label,value,col]of [[0,'Carbs','78g','#ad9c46'],[1,'Protein','23g','#f07863'],[2,'Fat','24g','#e6b452']]){let x=22+i*123;rect(o,x,224,114,80,15,'#fff',C.line);circle(o,x+20,244,5,col);text(o,label,x+33,236,13,C.muted);text(o,value,x+12,271,21,C.ink,500)}circle(o,194,320,3,C.ink);circle(o,210,320,3,'#ddd');
 rect(o,1,363,402,365,24,'#fff','#e4e4e4');text(o,'Nutrition score',22,392,19,C.ink,600);info(o,188,403,C.muted);text(o,'82',292,382,38,C.ink,600);text(o,'/100',342,398,20);line(o,25,447,379,447,'#eee',5);line(o,25,447,300,447,C.green,5);line(o,299,440,299,454,C.ink,4);
 paragraph(o,'Quinoa, egg and roasted vegetables make a varied meal. These are sample portions and estimates. Review them to match the meal you ate.',22,475,356,15,23);rect(o,102,606,200,30,15,'#fff9e6');text(o,'Balanced meal',146,612,15,'#ad7900');rect(o,81,653,242,48,24,'#fff','#d6d6d6');text(o,'✦',100,662,23);text(o,'Chat with Sara',140,667,16,C.ink,500);
 rect(o,1,740,402,478,24,'#fff','#e4e4e4');text(o,'Ingredients',22,779,15,C.muted);text(o,'+  Add',310,778,16,C.orange);
 const items=[['Quinoa','144 kcal','120g'],['Roasted vegetables','135 kcal','150g'],['Fried egg','100 kcal','1 egg'],['Kale','35 kcal','100g'],['Chickpeas','90 kcal','55g'],['Dressing','116 kcal','25g']];items.forEach((r,i)=>{let y=837+i*59;circle(o,38,y+17,16,'#fafafa');text(o,String(i+1),33,y+10,13);text(o,r[0],70,y,16,C.ink,500);text(o,r[1],70,y+26,12,C.muted);text(o,r[2],329,y+9,17)});
 rect(o,1,1230,402,80,24,'#fff','#e4e4e4');paragraph(o,'Does this meal look right?',22,1252,230,14,21);text(o,'✓',303,1257,23,C.muted);text(o,'×',354,1256,23,C.muted);save('food-information',o);
 // Camera overlay: transparent scene window retained, all labels in English.
 o=surface(417,894);status(o,true);circle(o,56,77,22,'#111');cross(o,56,77,'#fff');rect(o,125,55,162,42,22,'#151515');rect(o,126,56,81,40,22,'#fff');text(o,'Food',149,67,15,C.ink,500);text(o,'Label',229,67,15,'#aaa',500);circle(o,357,77,22,'#111');circle(o,357,77,10,null,'#fff');text(o,'?',352,68,14,'#fff');
 const c=o.c;c.strokeStyle='#fff';c.lineWidth=5;c.lineCap='round';for(const [x,y,sx,sy]of [[38,191,1,1],[378,191,-1,1],[38,630,1,-1],[378,630,-1,-1]]){c.beginPath();c.moveTo(x,y+sy*49);c.lineTo(x,y+sy*20);c.quadraticCurveTo(x,y,x+sx*20,y);c.lineTo(x+sx*50,y);c.stroke()}
 rect(o,88,666,241,49,25,'#111');for(let i=0;i<3;i++){c.save();c.beginPath();c.arc(112+i*20,690,17,0,Math.PI*2);c.clip();if(i===0)foodCrop(o,94+i*20,672,36,36);else if(i===1)c.drawImage(table,690,0,400,360,94+i*20,672,36,36);else c.drawImage(table,0,650,500,430,94+i*20,672,36,36);c.restore()}text(o,'Recent meals',173,681,13,'#fff',500);text(o,'⌃',298,682,13,'#fff');circle(o,208,799,34,null,'#fff');circle(o,208,799,29,'#fff');circle(o,76,799,24,'#111');rect(o,67,789,18,17,4,null,'#fff');circle(o,340,799,24,'#111');line(o,332,790,348,808,'#fff',3);rect(o,141,870,135,5,3,'#fff');save('scan',o);
 // Calorie budget: base goal + activity - food = remaining. Keep the header
 // compact enough for the existing 351px Rive image slot.
 o=card(351,268);streakFlame(o,21,22,22);text(o,'Calories today',54,25,19,C.ink,600);info(o,319,35,C.muted);
 arc(o,104,162,70,-Math.PI/2,Math.PI*1.5,'#f2f2f2',8);
 arc(o,104,162,70,-Math.PI/2,-Math.PI/2+2*Math.PI*(1610/2200),C.orange,8);
 centeredText(o,'590',104,132,40,C.ink,600);centeredText(o,'kcal left',104,183,13,C.muted);
 for(const [i,k,v]of [[0,'Goal','2,000'],[1,'Food','1,610'],[2,'Activity','+200']]){text(o,k,228,78+i*57,13,C.muted);text(o,v,228,99+i*57,21,C.ink,600)}save('today-calories',o);
 o=card(395,232);text(o,'Your BMI',16,24,18,C.ink,600);info(o,369,32);text(o,'22.4',16,65,30,C.ink,600);text(o,'Within the standard reference range',16,105,13,C.muted);let cols=['#93c5fd','#b2cb4d','#f8d184','#fb923c','#e65343','#8f2727'];cols.forEach((col,i)=>rect(o,16+i*60.5,139,61,12,0,col));line(o,144,136,144,154,'#737373',2);text(o,'18.5',68,160,11,C.muted);text(o,'24.9',164,160,11,C.muted);rect(o,85,187,225,28,15,'#f7f7f7');text(o,'View BMI categories',121,192,13,C.muted);save('bmi',o);
 o=card(351,358);centeredText(o,'Your weight goal',175.5,23,20,C.ink,600);
 const goalGreen='#667b20',c2=o.c;
 // The descending segment covers eight weeks; green shows maintenance after
 // reaching the target. Guides align labels with their actual chart points.
 c2.save();c2.setLineDash([4,5]);for(const y of [118,153,188])line(o,36,y,321,y,'#eeeeee');line(o,48,118,48,215,'#ffdccb');line(o,207,188,207,215,'#d9e3b5');c2.restore();
 rect(o,207,188,114,27,0,'#f4f7e7');centeredText(o,'Maintain',264,195,11,goalGreen,500);
 c2.beginPath();c2.moveTo(48,118);c2.bezierCurveTo(111,118,145,188,207,188);c2.strokeStyle=C.orange;c2.lineWidth=3;c2.stroke();line(o,207,188,321,188,goalGreen,3);
 rect(o,23,75,68,29,7,'#f7f7f7');centeredText(o,'168 lb',57,82,15,C.ink,600);circle(o,48,118,5,'#fff',C.orange);
 rect(o,171,142,72,32,8,goalGreen);centeredText(o,'160 lb',207,150,16,'#fff',600);circle(o,207,188,5,'#fff',goalGreen);
 text(o,'Today',24,228,13,C.ink,500);centeredText(o,'In 8 weeks',207,228,13,C.ink,500);
 for(let i=0;i<2;i++)rect(o,24+i*155,272,147,62,14,'#fff',C.line);
 text(o,'Time to goal',38,282,12,C.muted);text(o,'8 weeks',38,305,16,C.ink,600);text(o,'Weekly pace',193,282,12,C.muted);text(o,'1 lb / week',193,305,16,C.ink,600);save('review-card',o);
 o=card(404,369);text(o,'Nutrition score',22,32,19,C.ink,600);info(o,188,43,C.muted);text(o,'82',290,22,38,C.ink,600);text(o,'/100',339,38,20);line(o,25,87,379,87,'#eee',5);line(o,25,87,300,87,C.green,5);line(o,299,80,299,94,C.ink,4);paragraph(o,'Quinoa, egg and roasted vegetables make a varied meal. These are sample portions and estimates. Review them to match your meal.',22,118,356,15,23);rect(o,102,247,200,30,15,'#fff9e6');text(o,'Balanced meal',146,253,15,'#ad7900');rect(o,81,294,242,48,24,'#fff','#d6d6d6');text(o,'✦',100,303,23);text(o,'Chat with Sara',140,308,16,C.ink,500);save('meal-score',o);
 for(const [name,label,col,left,total]of [['starch','Carbs','#3e7b37',90,230],['protein','Protein','#e87562',45,120],['fat','Fat','#dfaa40',25,70]]){o=card(109,132);circle(o,24,28,6,col);text(o,label,36,22,11,C.muted);text(o,`${left}g left`,16,58,13,C.ink,600);line(o,18,82,91,82,'#e5e5e5',4);line(o,18,82,61,82,col,4);text(o,`of ${total}g`,16,100,12,C.muted);save(name,o)}
 o=card(178,185);streakFlame(o,65,18,48);centeredText(o,'12',89,76,28,C.orange,700);centeredText(o,'Day streak',89,111,14,C.ink,600);
 ['M','T','W','T','F','S','S'].forEach((t,i)=>{const x=29+i*20;centeredText(o,t,x,140,10,C.muted,500);circle(o,x,164,7,i<4?C.orange:'#e8e8e8');if(i<4){line(o,x-3,164,x-1,166,'#fff',1.4);line(o,x-1,166,x+3,161.5,'#fff',1.4)}});save('streak',o);
 o=card(351,172);circle(o,26,38,5,'#9fc4ff');text(o,'Water',41,30,12,C.muted);for(const [x,t]of [[272,'−'],[315,'+']]){circle(o,x,39,16,'#f7f7f7');text(o,t,x-6,28,21)}text(o,'8',20,72,27,C.ink,600);text(o,'/ 64 fl oz',43,83,15,C.muted);for(let i=0;i<8;i++){const c=o.c;c.beginPath();c.moveTo(20+i*40,112);c.lineTo(47+i*40,112);c.lineTo(42+i*40,148);c.lineTo(26+i*40,148);c.closePath();c.fillStyle=i===0?'#95bbff':'#f0f5ff';c.fill()}save('water',o);
 o=card(383,398);text(o,'Average calories',20,26,19,C.ink,600);text(o,'1,810',20,57,29,C.ink,600);text(o,'kcal',106,70,14,C.muted);for(let j=0;j<5;j++){let y=111+j*40;line(o,52,y,365,y,'#efefef');text(o,String(2400-j*600),13,y-5,10,C.muted)}for(let i=0;i<7;i++){let x=67+i*42,h=[142,165,155,174,149,168,158][i];rect(o,x,271-h,22,h,9,'#ffcf86');rect(o,x,271-h*.7,22,h*.7,0,C.orange);rect(o,x,271-h*.35,22,h*.35,0,'#adcc50');text(o,['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][i],x-1,282,10,C.muted)}text(o,'● Carbs',79,317,11,'#91b33c');text(o,'● Protein',151,317,11,C.orange);text(o,'● Fat',242,317,11,'#d4aa60');rect(o,19,346,345,31,17,'#f7f7f7');rect(o,20,347,90,29,16,'#fff');text(o,'This week',31,354,11,C.ink,500);text(o,'Last week',123,354,11,C.muted);text(o,'2 weeks ago',206,354,11,C.muted);text(o,'3 weeks ago',297,354,10,C.muted);save('calorie-average',o);
 await sharp(path.join(dir,'bg.webp')).resize(1920,1200,{fit:'cover'}).webp({quality:88}).toFile(path.join(root,'assets/hero/dietfit-hero-poster-us-en.webp'));
 await sharp(path.join(dir,'table-bench-clean.png')).resize(780,1688,{fit:'cover'}).webp({quality:88}).toFile(path.join(root,'assets/hero/dietfit-hero-poster-mobile-us-en.webp'));
 console.log('Rendered localized Rive image assets and EN-only posters.');
}
main().catch(e=>{console.error(e);process.exitCode=1});
