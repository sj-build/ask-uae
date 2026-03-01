"""Download specific landmark photos and upload to Supabase Storage"""
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
ADMIN_PW = env.get('ADMIN_PASSWORD', '')
CRON_SECRET = env.get('CRON_SECRET', '')
AUTH = CRON_SECRET or ADMIN_PW

# Curated photo IDs - verified relevant landmark photos
CURATED = {
    # Abu Dhabi
    'saadiyat-island': {
        'city': 'abudhabi',
        'query': 'Louvre Abu Dhabi',  # Louvre is Saadiyat's signature
    },
    'al-maryah-island': {
        'city': 'abudhabi',
        'query': 'Abu Dhabi skyline',  # ADGM financial hub
    },
    'downtown-corniche': {
        'city': 'abudhabi',
        'query': 'Abu Dhabi Corniche',
    },
    'yas-island': {
        'city': 'abudhabi',
        'query': 'Yas Island Abu Dhabi Ferrari World',
    },
    'al-reem-island': {
        'city': 'abudhabi',
        'query': 'Abu Dhabi residential towers waterfront',
    },
    'masdar-city': {
        'city': 'abudhabi',
        'query': 'Abu Dhabi eco city',  # Masdar doesn't return results directly
    },
    'kizad': {
        'city': 'abudhabi',
        'query': 'Khalifa Port Abu Dhabi industrial',
    },
    # Dubai
    'difc': {
        'city': 'dubai',
        'query': 'Dubai financial district',
    },
    'downtown-dubai': {
        'city': 'dubai',
        'query': 'Burj Khalifa Dubai skyline',
    },
    'business-bay': {
        'city': 'dubai',
        'query': 'Business Bay Dubai',
    },
    'dubai-marina': {
        'city': 'dubai',
        'query': 'Dubai Marina skyline yacht',
    },
    'jlt': {
        'city': 'dubai',
        'query': 'Jumeirah Lakes Towers Dubai skyline',
    },
    'internet-city-media-city': {
        'city': 'dubai',
        'query': 'Dubai Internet City',
    },
    'deira-old-dubai': {
        'city': 'dubai',
        'query': 'Dubai Creek traditional dhow boat',
    },
    'dubai-south': {
        'city': 'dubai',
        'query': 'Dubai Expo City 2020',
    },
}

BASE_URL = 'http://localhost:3000'

print("=== Refreshing all neighborhoods with landmark queries ===\n")

total = len(CURATED)
done = 0
ok = 0
failed = 0

for slug, info in CURATED.items():
    done += 1
    city = info['city']
    query = info['query']

    print(f"[{done}/{total}] {city}/{slug}")
    print(f"  query: '{query}'")

    payload = json.dumps({
        'city': city,
        'slug': slug,
        'queries': [query],
        'setActive': True,
        'topN': 1,  # Only 1 best photo per neighborhood
    }).encode()

    req = urllib.request.Request(
        f"{BASE_URL}/api/images/refresh",
        data=payload,
        headers={
            'Content-Type': 'application/json',
            'x-admin-secret': ADMIN_PW,
        },
    )

    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            result = json.loads(resp.read())

        if result.get('success'):
            selected = result.get('selected', [])
            if selected:
                s = selected[0]
                print(f"  OK: {s['photographer']} (score: {s['quality_score']})")
                ok += 1
            else:
                print(f"  WARNING: success but no photos selected")
                failed += 1
        else:
            print(f"  FAILED: {result.get('error', 'unknown')}")
            failed += 1
    except Exception as e:
        print(f"  ERROR: {e}")
        failed += 1

    print()
    time.sleep(1)

print(f"\n=== DONE: {total} total | {ok} OK | {failed} failed ===")
