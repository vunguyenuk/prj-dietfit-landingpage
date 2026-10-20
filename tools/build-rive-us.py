"""Repack image assets into EN-only Rive exports; preserve all animation bytes.

Run tools/build-rive-us.cjs first to render the source UI images.
This uses only Python's standard library. No original .riv is overwritten.
"""
from pathlib import Path
import hashlib,json
ROOT=Path(__file__).resolve().parents[1]
ART=ROOT/'assets/hero/us-en'
REPLACEMENTS={
 'BMI':'bmi.png','Food information':'food-information.png','bg':'bg.webp',
 'Today calo':'today-calories.png','Scan':'scan.png','Starch':'starch.png',
 'Series of days':'streak.png','food':'food.webp','review card':'review-card.png',
 'Meal score':'meal-score.png','hands':'hands.webp','Protein':'protein.png',
 'Fat':'fat.png','Drink':'water.png','Calo average':'calorie-average.png',
}
def read_var(b,at):
 n=0;shift=0
 while True:
  v=b[at];at+=1;n|=(v&127)<<shift
  if not v&128:return n,at
  shift+=7
  if shift>35:raise ValueError('Invalid varuint')
def write_var(n):
 out=bytearray()
 while n>=128:out.append((n&127)|128);n>>=7
 out.append(n);return bytes(out)
def assets(b):
 found=[];at=0
 while True:
  at=b.find(b'\x00i\xcb\x01',at)
  if at<0:break
  start=at;at+=4
  try:
   size,p=read_var(b,at)
   if not 0<size<100:continue
   name=b[p:p+size].decode('utf8');p+=size
   if b[p:p+2]!=b'\xcc\x01':continue
   content=b.find(b'\x00j\xd4\x01',p,p+100)
   if content<0:continue
   length_at=content+4;length,data_at=read_var(b,length_at)
   if data_at+length>len(b):continue
   if not (b[data_at:data_at+4]==b'RIFF' or b[data_at:data_at+4]==b'\x89PNG'):continue
   found.append(dict(name=name,length_at=length_at,data_at=data_at,end=data_at+length,length=length))
   at=data_at+length
  except (UnicodeError,IndexError):continue
 return found

def skeleton(b):
 # The complete stream excluding replaced image lengths/payloads.
 parts=[];at=0
 for a in assets(b):
  if a['name'] not in REPLACEMENTS:continue
  parts.append(b[at:a['length_at']]);at=a['end']
 parts.append(b[at:]);return b''.join(parts)

def main():
 report=[]
 for stem in ['dietfit-hero','dietfit-hero-responsive']:
  source=ROOT/f'assets/hero/{stem}-en.riv';dest=ROOT/f'assets/hero/{stem}-us-en.riv'
  before=source.read_bytes();after=before;changed=[]
  original=assets(before)
  assert len(original)==18,(stem,len(original))
  for a in reversed(original):
   if a['name'] not in REPLACEMENTS:continue
   payload=(ART/REPLACEMENTS[a['name']]).read_bytes()
   after=after[:a['length_at']]+write_var(len(payload))+payload+after[a['end']:]
   changed.append(a['name'])
  assert skeleton(before)==skeleton(after),'A non-image byte changed'
  assert len(changed)==15,(stem,changed)
  dest.write_bytes(after)
  report.append(dict(source=source.name,output=dest.name,sourceBytes=len(before),outputBytes=len(after),replacedImages=sorted(changed),unmodifiedAnimationSkeletonSha256=hashlib.sha256(skeleton(after)).hexdigest()))
 (ART/'manifest.json').write_text(json.dumps(report,indent=2)+'\n')
 print(json.dumps(report,indent=2))
if __name__=='__main__':main()
