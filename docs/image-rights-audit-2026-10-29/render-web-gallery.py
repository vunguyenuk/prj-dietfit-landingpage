from pathlib import Path
from collections import Counter
import json,html
out=Path(__file__).resolve().parent
records=json.loads((out/'inventory.json').read_text());web=json.loads((out/'web-evidence.json').read_text())
e=html.escape
findings={x['id']:x for x in web['findings']}
photo_groups={'Figma-photo','user-supplied-watermark','AI-edit-reference','AI-edited-food-reference','AI-generated-food','Nutrition5k-attributed-photo','before-after-people','blog-photo','captured-people-brand-photo','footer-people-photo','social-UGC','team-portrait','community-artwork'}
selected=[];seen=set()
# Focus on actual photos and embedded photo artwork; skip resolution duplicates.
for r in records:
 if r['group'] not in photo_groups or not r['path'].startswith('/') or '@2x' in r['path']:continue
 if r['sha256'] in seen:continue
 seen.add(r['sha256']);selected.append(r)
order={'copyrighted':0,'licensed':1,'conditional':2,'unknown':3}
selected.sort(key=lambda r:(order[r['rights_category']],r['path']))
cards=[]
for r in selected:
 f=findings.get(r['web_finding_id']);category=r['rights_category']
 title={'copyrighted':'Có bản quyền','licensed':'Có bản quyền · được dùng theo license','conditional':'Có license · cần đối chiếu','unknown':'Chưa xác định bản quyền'}[category]
 details='<p>'+e(r['evidence'])+'</p>'
 if f:
  links=' · '.join('<a href="'+e(u,quote=True)+'" target="_blank" rel="noopener">Nguồn '+str(i+1)+'</a>' for i,u in enumerate(f['urls']))
  details+='<p>'+e(f['license_note'])+'</p><p>'+links+'</p><figure><img loading="lazy" src="evidence/'+e(f['screenshot'])+'" alt="Ảnh công khai dùng để đối chiếu"><figcaption>Ảnh đối chiếu · '+e(f['match'])+'</figcaption></figure>'
 elif category=='unknown':
  details+='<p>Chưa có bằng chứng để ghi “không bản quyền”. Pinterest là nơi tìm ảnh, không tự cấp giấy phép dùng lại.</p>'
 cards.append('<article data-status="'+category+'"><img class="photo" loading="lazy" src="'+e(r['path'])+'" alt="'+e(Path(r['path']).name)+'"><div class="body"><span class="tag '+category+'">'+title+'</span><h2>'+e(Path(r['path']).name)+'</h2><p class="usage">'+e(r['usage_label'])+'</p><p class="routes">'+e(' · '.join(r['routes']))+'</p><details><summary>Xem nguồn &amp; bằng chứng</summary>'+details+'</details></div></article>')
counts=Counter(r['rights_category'] for r in selected)
buttons=[('all','Tất cả',len(selected)),('licensed','Được dùng theo license',counts['licensed']),('copyrighted','Có bản quyền · quyền dùng chưa rõ',counts['copyrighted']),('unknown','Chưa xác định',counts['unknown']),('conditional','Cần đối chiếu license',counts['conditional'])]
filters=''.join('<button type="button" data-filter="'+key+'" aria-pressed="'+('true' if key=='all' else 'false')+'">'+label+' <span>'+str(n)+'</span></button>' for key,label,n in buttons)
(out/'priority-gallery.html').write_text('''<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Dietfit — bản quyền ảnh</title><style>*{box-sizing:border-box}body{margin:0;background:#faf8f5;color:#292524;font:15px/1.55 system-ui}main{max-width:1280px;margin:auto;padding:40px 24px 80px}header{max-width:950px;margin-bottom:24px}h1{font-size:32px;line-height:1.2}h2{font-size:14px;overflow-wrap:anywhere;margin:14px 0 8px}p{margin:0 0 12px}a{color:#a34427;text-underline-offset:3px}.filters{display:flex;flex-wrap:wrap;gap:8px;margin:24px 0}.filters button{font:inherit;font-size:13px;border:1px solid #d8d3cb;border-radius:10px;background:white;padding:10px 13px;cursor:pointer}.filters button[aria-pressed=true]{background:#292524;color:white;border-color:#292524}.filters span{opacity:.7;margin-left:5px}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}article{border:1px solid #e7e4df;background:white;border-radius:16px;overflow:hidden;align-self:start}article[hidden]{display:none}.photo{display:block;width:100%;height:250px;object-fit:contain;background:#f2eee8}.body{padding:18px}.tag{display:inline-block;font-size:12px;line-height:1.5;font-weight:600;border-radius:7px;padding:5px 9px}.copyrighted{color:#8b3830;background:#fbece8}.licensed{color:#28603d;background:#eaf3ed}.unknown,.conditional{color:#795817;background:#fff2d5}.usage{font-size:14px}.routes{font-size:12px;color:#78716c;overflow-wrap:anywhere}details{font-size:13px;color:#57534e}summary{cursor:pointer;text-decoration:underline;text-underline-offset:3px}details p:first-of-type{margin-top:12px}figure{margin:14px 0 0}figure img{width:100%;height:230px;object-fit:contain;background:#f2eee8}figcaption{font-size:11px;margin-top:6px}.note{padding:14px 18px;background:white;border-left:3px solid #d8a768}.count{font-size:13px;color:#78716c;margin-bottom:16px}@media(max-width:900px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:580px){main{padding:24px 16px}.grid{grid-template-columns:1fr}h1{font-size:27px}.photo{height:280px}}</style><main><header><h1>Bản quyền các ảnh đang dùng</h1><p>29/10/2026 · Xem nhãn ngay trên mỗi ảnh; nguồn và bằng chứng nằm trong phần mở rộng.</p><p class="note"><strong>Ảnh trên Pinterest vẫn có thể có bản quyền.</strong> “Có bản quyền” và “được phép sử dụng” là hai việc khác nhau. Hiện chưa xác nhận ảnh nào thuộc public domain/CC0 để ghi “không bản quyền”. <a href="https://help.pinterest.com/en/article/copyright" target="_blank" rel="noopener">Hướng dẫn của Pinterest</a></p><p><a href="report.md">Báo cáo</a> · <a href="inventory.csv">Danh sách đầy đủ</a></p></header><nav class="filters" aria-label="Lọc theo quyền ảnh">'''+filters+'</nav><p class="count" role="status">'+str(len(selected))+' ảnh/ảnh ghép · đã gộp bản độ phân giải</p><section class="grid" aria-label="Ảnh đang sử dụng">'+''.join(cards)+'''</section></main><script>const buttons=[...document.querySelectorAll('[data-filter]')],cards=[...document.querySelectorAll('article[data-status]')];buttons.forEach(button=>button.addEventListener('click',()=>{buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));cards.forEach(card=>card.hidden=button.dataset.filter!=='all'&&card.dataset.status!==button.dataset.filter);document.querySelector('[role=status]').textContent=cards.filter(card=>!card.hidden).length+' ảnh/ảnh ghép · đã gộp bản độ phân giải'}));</script></html>''')
print('Labeled photo gallery:',len(selected),dict(counts))
