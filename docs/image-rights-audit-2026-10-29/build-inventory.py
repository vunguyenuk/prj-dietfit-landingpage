from pathlib import Path
from urllib.parse import urlsplit,unquote
from collections import defaultdict,Counter
from html.parser import HTMLParser
import json,hashlib,csv,re
root=Path('/Users/vunguyen/Desktop/prj-dietfit-landingpage');out=root/'docs/image-rights-audit-2026-10-29'
exts={'.webp','.png','.jpg','.jpeg','.svg','.avif','.gif','.ico'}
used=defaultdict(lambda:{'routes':set(),'contexts':set()})
for filename in ['live-usage.json','mobile-usage.json']:
 data=json.loads((out/filename).read_text())
 for page in data['pages']:
  for item in page['images']:
   u=urlsplit(item['url']);p=unquote(u.path)
   if Path(p).suffix.lower() not in exts:continue
   host='' if u.netloc in ['127.0.0.1:4180','dietfit.health','www.dietfit.health'] else u.netloc
   used[(host,p)]['routes'].add(page['route']);used[(host,p)]['contexts'].add('mobile' if filename.startswith('mobile') else 'desktop')
class MetaImages(HTMLParser):
 def __init__(self):super().__init__();self.images=[]
 def handle_starttag(self,tag,attrs):
  d=dict(attrs)
  if tag=='meta' and (d.get('property','').startswith('og:image') or d.get('name','').startswith('twitter:image')) and d.get('content'):
   self.images.append(d['content'])
htmls=[root/'index.html']
for folder in ['en','vi','about-us','blog']:
 htmls.extend((root/folder).rglob('*.html'))
for file in htmls:
 parser=MetaImages();parser.feed(file.read_text())
 route='/'+str(file.relative_to(root)).removesuffix('index.html')
 for raw in parser.images:
  u=urlsplit(raw);p=unquote(u.path)
  if Path(p).suffix.lower() not in exts:continue
  host='' if u.netloc in ['127.0.0.1:4180','dietfit.health','www.dietfit.health',''] else u.netloc
  used[(host,p)]['routes'].add(route);used[(host,p)]['contexts'].add('social-meta')
# Evidence classification is explicitly an audit of available records, not a legal clearance.
photo_edits={'apple-health-reference/active-friends.webp':'assets/cards/apple-health-reference/source.md','challenge-reference/football-pitch.webp':'assets/cards/challenge-reference/source.md','diary-reference/phone-at-desk.webp':'assets/cards/diary-reference/source.md','fasting-reference/watch-forward.webp':'assets/cards/fasting-reference/source.md','progress-reference/phone-in-hand.webp':'assets/cards/progress-reference/source.md','reminder-reference/green-phone.webp':'assets/cards/reminder-reference/source.md','reward-reference/tennis-court.webp':'assets/cards/reward-reference/source.md','streak-reference/stretching-sky.webp':'assets/cards/streak-reference/source.md','together-reference/friends-garden.webp':'assets/cards/together-reference/friends-source.md'}
generated_food={'diary-reference/avocado-breakfast.webp':'assets/cards/diary-reference/food-source.md','diary-reference/salmon-grain-bowl.webp':'assets/cards/diary-reference/food-source.md','together-reference/chicken-rice.webp':'assets/cards/together-reference/food-source.md','together-reference/shrimp-avocado-salad.webp':'assets/cards/together-reference/food-source.md'}
def classify(p):
 rel=p.removeprefix('/assets/cards/')
 if rel in photo_edits:return ('P1','AI-edit-reference','Chưa có giấy phép ảnh tham khảo','Hồ sơ ghi chỉnh ảnh người/ảnh tham khảo; không có tác giả, URL gốc hoặc quyền thương mại',photo_edits[rel],'Xác nhận giấy phép ảnh gốc và quyền dùng hình người; hoặc thay bằng ảnh đã cấp phép')
 if rel in generated_food:return ('P3','AI-generated-food','Có hồ sơ tạo ảnh','Prompt tạo ảnh đồ ăn mới được lưu; không có quyền từ một nhà cung cấp stock trong hồ sơ',generated_food[rel],'Lưu hồ sơ tạo ảnh và điều khoản dịch vụ; rà nội dung trước xuất bản')
 if '/about-photos/dinner-shelf' in p:return ('P1','user-supplied-watermark','Chưa có giấy phép','Ảnh đính kèm có watermark TVCBOOK; sharpen không tạo giấy phép mới','assets/about-photos/source.md','Xác nhận chủ sở hữu/giấy phép dùng quảng cáo; nếu không có thì thay ảnh, không xóa watermark để coi là đã cấp phép')
 if '/about-figma/' in p or '/about-photos/office-lunch' in p:return ('P2','Figma-photo','Có nguồn Figma, thiếu giấy phép ảnh','Figma node được ghi, không có stock ID/tác giả/hóa đơn hoặc license ảnh','assets/about-figma/source.md; assets/about-photos/source.md','Đối chiếu hồ sơ mua/chụp ảnh từ người quản lý file Figma')
 if '/team/' in p:return ('P2','team-portrait','Thiếu hồ sơ quyền ảnh/chấp thuận','Tên nhân sự được ghi trong filename; chưa tìm thấy release/consent hoặc tác giả','','Xác nhận quyền ảnh với team và nhiếp ảnh gia; lưu đồng ý dùng trên website')
 if '/blog/' in p:return ('P2','blog-photo','Không tìm thấy nguồn/giấy phép','Ảnh dùng trong content/blog-posts.json; chưa tìm thấy hồ sơ tác giả hoặc stock URL','content/blog-posts.json','Bổ sung nguồn + license cho từng ảnh hoặc thay ảnh')
 if '/og/' in p:return ('P2','social-preview','Chưa rõ quyền ảnh nền','Ảnh preview chia sẻ của các trang; chưa tìm thấy provenance riêng','tools/build.py','Truy ngược các lớp ảnh nền, kế thừa hồ sơ license từ ảnh gốc')
 if '/final-cta-us-en-user-photo.webp' in p:return ('P1','captured-people-brand-photo','Chưa có nguồn/giấy phép','Ảnh nhóm bạn ở Home EN có bao bì và logo McDonald’s; tên file là user-photo không phải chứng từ license','dietfit-health-2026-10-27T03-18-56-616Z/.capture-index.json','Tìm tác giả/chiến dịch và quyền dùng thương mại; không mặc định ảnh trong capture đã được cấp phép')
 if '/progress-en-' in p or '/dietfit-progress-before' in p or '/dietfit-progress-after' in p:return ('P1','before-after-people','Chưa có quyền ảnh/consent minh chứng','Ảnh before/after người thật đang dùng; hồ sơ các ảnh AI -v1 cũ không khớp file đang chạy','','Xác nhận chủ ảnh, sự đồng ý và căn cứ cho case before/after; không coi đây là ảnh AI chỉ dựa vào prompt file cũ')
 if '/social/' in p or '/vi/fYZWilyeuHM/' in p:return ('P1','social-UGC','Chưa có quyền tái sử dụng marketing','Ảnh/video social hoặc thumbnail YouTube; link công khai không phải chứng từ tái sử dụng','','Xin/đối chiếu đồng ý của chủ nội dung và người xuất hiện')
 if '/final-cta.webp' in p:return ('P2','footer-people-photo','Không tìm thấy nguồn/giấy phép','Ảnh nhóm người ở footer VI; không đồng nhất với asset AI EN -v1 cũ','','Bổ sung tác giả/stock ID/model release hoặc thay bằng ảnh có hồ sơ')
 if '/plate_1563216440.jpg' in p:return ('P2','Nutrition5k-attributed-photo','Giấy phép dataset rõ; cần hoàn thiện đối chiếu/attribution','Bản report ghi Nutrition5k © Google Research CC BY 4.0; file được mang từ capture; chưa đối chiếu hash với ảnh dataset gốc','content/components/benchmark-method-details.html; https://github.com/google-research-datasets/Nutrition5k','Xác nhận dish/source gốc; bổ sung link CC BY 4.0 và ghi chỉnh sửa/overlay nếu áp dụng')
 if '/app-icons/' in p:return ('P2','competitor-app-icon','Nguồn chính thức, quyền dùng riêng cần kiểm tra','App Store/developer icon URL có ghi; không có thư cấp phép marketing chung','assets/benchmarks-editorial/app-icons/source.md','Rà brand guidelines cho mục đích so sánh; không ngụ ý tài trợ/đối tác')
 if '/integrations/' in p or p.endswith('/apple.svg') or p.endswith('/play.svg'):return ('P2','third-party-brand','Nguồn brand, cần điều kiện sử dụng','Artwork App Store/brand có hoặc có thể truy nguồn; chưa có bộ approval/guidelines lưu cho từng brand','assets/integrations/source.json; https://www.apple.com/legal/intellectual-property/guidelinesfor3rdparties.html','Đối chiếu guidelines và phạm vi tích hợp; không coi official download là giấy phép tùy ý')
 if '/brand/mascots/' in p:return ('P2','Dietfit-mascot','Nguồn thiết kế nội bộ; cần xác nhận quyền sở hữu','Mascot từ Figma; một số pose hậu kỳ/generate có hồ sơ; chưa thấy văn bản chuyển giao bản quyền','assets/brand/mascots/3d/source.json; assets/brand/mascots/source.json','Xác nhận Dietfit sở hữu/có quyền dùng mascot và các ảnh đầu vào')
 if '/production/' in p or '/figma-meal-detail/' in p or '/cards/figma-sync/' in p or '/product/v2/icons/' in p:return ('P2','Dietfit-design-export','Nguồn thiết kế nội bộ; chưa xác minh chuyển giao','Nguồn Figma/capture được ghi; quyền với hình ảnh nhúng cần truy riêng','assets/cards/figma-sync/source.json; assets/hero/figma-meal-detail/source.json; assets/brand/production/source.md','Lưu xác nhận sở hữu thiết kế; tách quyền ảnh nhúng khỏi quyền UI')
 if '/meal-no-hand.webp' in p:return ('P2','AI-edited-food-reference','Có hồ sơ sửa ảnh; nguồn gốc đầu vào chưa được cấp phép','Xóa tay bằng imagegen, đầu vào từ Home bowl đã AI chỉnh từ ảnh người dùng','assets/benchmarks-editorial/stickers/hand-removal.md; assets/hero/us-en/photo-sources.json','Xác nhận quyền ảnh đầu vào; lưu chuỗi chỉnh sửa')
 if '/hero/deep-scan/meal.webp' in p:return ('P2','AI-edited-food-reference','Có hồ sơ sửa ảnh; nguồn ảnh người dùng chưa có license','Cutout từ meal-hand-source.png, ảnh người dùng được AI chỉnh phối cảnh','assets/hero/deep-scan/source.json; assets/hero/us-en/photo-sources.json','Xác nhận ảnh đầu vào; không suy ra quyền thương mại từ việc dùng AI')
 if '/demos/' in p or '/hero/meal-plan/' in p or '/product/v2/scan/' in p or '/product/v2/meal.' in p or '/product/v2/salmon.' in p:return ('P2','product-media-with-photo','Nguồn product/capture; ảnh nhúng chưa rõ quyền','Poster/video/product UI chứa ảnh món ăn, không có tác giả/license cho từng ảnh','dietfit-health-2026-10-27T03-18-56-616Z/.capture-index.json','Đối chiếu ảnh thức ăn và video nguồn; inventory ảnh ngoài không bao phủ từng frame')
 if '/hero/' in p or '/shared/' in p:return ('P2','hero-or-product-art','Nguồn capture/Figma; cần kiểm tra lớp ảnh','Poster, khung điện thoại hoặc artwork; chưa xác minh license riêng','assets/hero/us-en/photo-sources.json; dietfit-health-2026-10-27T03-18-56-616Z/.capture-index.json','Rà từng lớp ảnh nhúng trong Rive/poster/khung và hồ sơ nguồn')
 if '/community/' in p:return ('P2','community-artwork','Thiếu quyền các lớp ảnh nhúng','Banner gắn Dietfit nhưng không có provenance riêng cho hình nền/mẫu người','','Xác nhận artwork do Dietfit sở hữu và quyền ảnh nền')
 if 'logo' in p or 'app-icon' in p:return ('P3','Dietfit-brand','Asset nội bộ theo ngữ cảnh dự án','Logo/app icon Dietfit; nguồn Figma/capture, chưa có hợp đồng chuyển giao trong repo','','Lưu hồ sơ sở hữu/thỏa thuận thiết kế nội bộ')
 return ('P2','unresolved','Chưa xác định','Không tìm thấy hồ sơ nguồn gắn trực tiếp với file','','Bổ sung tác giả, nguồn, license và phạm vi sử dụng')
records=[]
for (host,p),u in sorted(used.items()):
 file=root/p.lstrip('/');sha=hashlib.sha256(file.read_bytes()).hexdigest() if not host and file.exists() else ''
 pr,group,status,evidence,source,action=classify(p)
 records.append(dict(path=('https://'+host+p) if host else p,priority=pr,group=group,status=status,routes=sorted(u['routes']),contexts=sorted(u['contexts']),sha256=sha,evidence=evidence,source=source,action=action))
import runpy
records=runpy.run_path(str(out/'apply-web-evidence.py'))['enrich'](records)
(out/'inventory.json').write_text(json.dumps(records,ensure_ascii=False,indent=2))
with (out/'inventory.csv').open('w',newline='',encoding='utf-8-sig') as f:
 writer=csv.DictWriter(f,fieldnames=list(records[0]));writer.writeheader();writer.writerows({**r,'routes':' | '.join(r['routes']),'contexts':' | '.join(r['contexts']),'public_source_urls':' | '.join(r['public_source_urls'])} for r in records)
summary={'url_count':len(records),'local_unique_hashes':len({r['sha256'] for r in records if r['sha256']}),'external_count':sum(r['path'].startswith('https://') for r in records),'main_routes':8,'viewports':[1440,390],'metadata_pages':len(htmls),'groups':dict(Counter(r['group'] for r in records)),'priorities':dict(Counter(r['priority'] for r in records))}
(out/'summary.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2));print(json.dumps(summary,ensure_ascii=False,indent=2))
