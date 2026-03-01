"""Search Unsplash for neighborhoods that returned no results"""
import os
import json
import urllib.request
import urllib.parse
import time
import sys

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

# Broader queries for neighborhoods that failed
RETRY_QUERIES = {
    'al-maryah-island': ['Abu Dhabi skyline', 'Abu Dhabi city modern'],
    'downtown-corniche': ['Abu Dhabi Corniche', 'Abu Dhabi waterfront'],
    'masdar-city': ['Masdar City', 'Abu Dhabi sustainable city'],
    'difc': ['DIFC Dubai', 'Dubai financial centre'],
    'business-bay': ['Business Bay Dubai', 'Dubai canal towers'],
    'internet-city-media-city': ['Dubai Internet City', 'Dubai technology hub office'],
}

print("=== Retry with broader queries ===\n")

for slug, queries in RETRY_QUERIES.items():
    found = False
    for query in queries:
        url = f"https://api.unsplash.com/search/photos?query={urllib.parse.quote(query)}&per_page=5&orientation=landscape"
        req = urllib.request.Request(url, headers={'Authorization': f'Client-ID {UNSPLASH_KEY}'})
        try:
            with urllib.request.urlopen(req) as resp:
                data = json.loads(resp.read())
        except Exception as e:
            print(f"{slug}: ERROR on '{query}' - {e}")
            time.sleep(1)
            continue

        results = data.get('results', [])
        chosen = None
        for r in results:
            if r['width'] >= 1600 and r['height'] >= 900:
                chosen = r
                break
        if not chosen and results:
            chosen = results[0]

        if chosen:
            desc = (chosen.get('alt_description') or chosen.get('description') or '')[:60]
            print(f"{slug:30s} id={chosen['id']:12s} {chosen['width']}x{chosen['height']} by {chosen['user']['name']}")
            print(f"{'':30s} query: '{query}'")
            print(f"{'':30s} \"{desc}\"")
            print(f"{'':30s} preview: {chosen['urls']['small']}")
            print()
            found = True
            break

        time.sleep(0.5)

    if not found:
        print(f"{slug:30s} STILL NO RESULTS")
        print()
