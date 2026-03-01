"""Search Unsplash for best landmark photo per neighborhood"""
import os
import json
import urllib.request
import urllib.parse
import time
import sys

# Read .env.local
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env.local')
env = {}
with open(env_path) as f:
    for line in f:
        line = line.strip()
        if not line or line.startswith('#'):
            continue
        if '=' in line:
            k, v = line.split('=', 1)
            env[k.strip()] = v.strip().strip('"').strip("'")

UNSPLASH_KEY = env.get('UNSPLASH_ACCESS_KEY', '')
if not UNSPLASH_KEY:
    print("ERROR: UNSPLASH_ACCESS_KEY not found")
    sys.exit(1)

# Each neighborhood -> its most recognizable landmark
LANDMARK_QUERIES = {
    'saadiyat-island': 'Louvre Abu Dhabi museum exterior',
    'al-maryah-island': 'Abu Dhabi financial district skyline',
    'downtown-corniche': 'Abu Dhabi Corniche waterfront skyline',
    'yas-island': 'Yas Island Abu Dhabi Ferrari World',
    'al-reem-island': 'Abu Dhabi residential towers waterfront',
    'masdar-city': 'Masdar City sustainable architecture',
    'kizad': 'Khalifa Port Abu Dhabi industrial',
    'difc': 'DIFC Gate Building Dubai financial',
    'downtown-dubai': 'Burj Khalifa Dubai skyline',
    'business-bay': 'Business Bay Dubai canal skyline',
    'dubai-marina': 'Dubai Marina skyline yacht',
    'jlt': 'Jumeirah Lakes Towers Dubai skyline',
    'internet-city-media-city': 'Dubai Media City technology park',
    'deira-old-dubai': 'Dubai Creek traditional dhow boat',
    'dubai-south': 'Dubai Expo City 2020',
}

print("=== Best Landmark Photos ===\n")

for slug, query in LANDMARK_QUERIES.items():
    url = f"https://api.unsplash.com/search/photos?query={urllib.parse.quote(query)}&per_page=5&orientation=landscape"
    req = urllib.request.Request(url, headers={'Authorization': f'Client-ID {UNSPLASH_KEY}'})

    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read())
    except Exception as e:
        print(f"{slug}: ERROR - {e}")
        time.sleep(1)
        continue

    results = data.get('results', [])

    # Pick best: prefer >= 1600x900
    chosen = None
    for r in results:
        if r['width'] >= 1600 and r['height'] >= 900:
            chosen = r
            break
    if not chosen and results:
        chosen = results[0]

    if chosen:
        desc = (chosen.get('alt_description') or chosen.get('description') or 'no description')[:60]
        print(f"{slug:30s} id={chosen['id']:12s} {chosen['width']}x{chosen['height']} by {chosen['user']['name']}")
        print(f"{'':30s} \"{desc}\"")
        print(f"{'':30s} preview: {chosen['urls']['small']}")
    else:
        print(f"{slug:30s} NO RESULTS for '{query}'")

    print()
    time.sleep(0.5)
