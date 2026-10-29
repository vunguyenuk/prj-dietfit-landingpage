from pathlib import Path
import json
out=Path(__file__).resolve().parent
web=json.loads((out/'web-evidence.json').read_text())
findings={p:r for r in web['findings'] for p in r['paths']}
searched=set(findings)
searched.update('/assets/blog/blog-%02d.webp'%i for i in range(1,7))
searched.update('/assets/cards/'+p for p in ['apple-health-reference/active-friends.webp','challenge-reference/football-pitch.webp','diary-reference/phone-at-desk.webp','fasting-reference/watch-forward.webp','progress-reference/phone-in-hand.webp','reminder-reference/green-phone.webp','reward-reference/tennis-court.webp','streak-reference/stretching-sky.webp','together-reference/friends-garden.webp'])
def enrich(records):
 for r in records:
  r['internet_checked']='2026-10-29' if r['path'] in searched else ''
  r['source_match']='not-found-in-this-search' if r['path'] in searched else 'not-individually-researched'
  r['public_source_urls']=[];r['public_license_note']='';r['web_finding_id']=''
  # Missing repo evidence is not a finding that no license exists.
  r['status']=r['status'].replace('Chưa có giấy phép ảnh tham khảo','Chưa xác minh giấy phép ảnh tham khảo').replace('Chưa có giấy phép','Chưa xác minh giấy phép').replace('thiếu giấy phép ảnh','chưa xác minh giấy phép ảnh')
  if r['path'] in findings:
   f=findings[r['path']];r.update(status=f['status'],source_match=f['match'],public_source_urls=f['urls'],public_license_note=f['license_note'],web_finding_id=f['id'],evidence=f['observation'],action=f['action'])
   if f['id']=='blog-podcast':r['priority']='P3'
  r['copyright_label']='Chưa xác định'
  r['usage_label']='Chưa xác minh quyền sử dụng'
  r['rights_category']='unknown'
  if r['web_finding_id']=='blog-podcast':
   r.update(copyright_label='Có bản quyền',usage_label='Được dùng theo Pexels License',rights_category='licensed')
  elif r['web_finding_id']=='mcdonalds-footer':
   r.update(copyright_label='Có bản quyền — McDonald’s Deutschland',usage_label='Chỉ thấy quyền dùng biên tập; chưa xác minh marketing',rights_category='copyrighted')
  elif r['group']=='Nutrition5k-attributed-photo':
   r.update(copyright_label='Dataset có bản quyền — Google Research',usage_label='Dataset CC BY 4.0; cần khớp file gốc và ghi nguồn',rights_category='conditional')
 return records
if __name__=='__main__':
 import csv
 records=enrich(json.loads((out/'inventory.json').read_text()));(out/'inventory.json').write_text(json.dumps(records,ensure_ascii=False,indent=2))
 with (out/'inventory.csv').open('w',newline='',encoding='utf-8-sig') as f:
  w=csv.DictWriter(f,fieldnames=list(records[0]));w.writeheader();w.writerows({**r,**{k:' | '.join(r[k]) for k in ['routes','contexts','public_source_urls']}} for r in records)
