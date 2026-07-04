import urllib.request
import re

urls_to_try = [
    'https://transformingindia.mygov.in/',
    'https://www.india.gov.in/',
    'https://www.digitalindia.gov.in/'
]

banners = set()

for url in urls_to_try:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req, timeout=10).read().decode('utf-8', errors='ignore')
        # Find all jpg/png that might be banners
        matches = re.findall(r'https?://[^\"\']+\.(?:jpg|jpeg|png)', html)
        for m in matches:
            if 'banner' in m.lower() or 'slider' in m.lower() or 'carousel' in m.lower() or 'campaign' in m.lower():
                banners.add(m)
    except Exception as e:
        print(f"Failed {url}: {e}")

print("Banners found:")
for b in list(banners)[:10]:
    print(b)
