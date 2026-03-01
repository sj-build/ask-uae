"""Directly download and upload remaining 4 neighborhoods"""
import os
import json
import urllib.request
import urllib.parse
import time

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

UNSPLASH_KEY = env['UNSPLASH_ACCESS_KEY']
SUPABASE_URL = env['NEXT_PUBLIC_SUPABASE_URL']
SUPABASE_KEY = env['SUPABASE_SERVICE_ROLE_KEY']

REMAINING = {
    'jlt': {'city': 'dubai', 'query': 'Jumeirah Lakes Towers Dubai'},
    'internet-city-media-city': {'city': 'dubai', 'query': 'Dubai Internet City'},
    'deira-old-dubai': {'city': 'dubai', 'query': 'Dubai Creek dhow'},
    'dubai-south': {'city': 'dubai', 'query': 'Dubai Expo City'},
}

for slug, info in REMAINING.items():
    city = info['city']
    query = info['query']
    print(f"\n=== {slug} (query: '{query}') ===")

    # 1. Search Unsplash (use subprocess curl to avoid Python SSL issues)
    import subprocess
    search_url = f"https://api.unsplash.com/search/photos?query={urllib.parse.quote(query)}&per_page=5&orientation=landscape"
    result_raw = subprocess.run(
        ['curl', '-s', search_url, '-H', f'Authorization: Client-ID {UNSPLASH_KEY}'],
        capture_output=True, text=True, timeout=15
    )
    data = json.loads(result_raw.stdout)

    results = data.get('results', [])
    if not results:
        print("  NO RESULTS - skipping")
        continue

    # Pick best >= 1600 wide
    photo = None
    for r in results:
        if r['width'] >= 1600:
            photo = r
            break
    if not photo:
        photo = results[0]

    photo_id = photo['id']
    photographer = photo['user']['name']
    photographer_url = photo['user']['links']['html']
    source_url = photo['links']['html']
    width = photo['width']
    height = photo['height']
    desc = photo.get('alt_description') or photo.get('description') or ''

    print(f"  Photo: {photo_id} {width}x{height} by {photographer}")
    print(f"  Desc: {desc[:60]}")

    # 2. Download photo
    dl_url = f"{photo['urls']['raw']}&w=2400&q=85&fm=jpg&fit=crop"
    dl_result = subprocess.run(
        ['curl', '-sL', dl_url, '-o', '/tmp/unsplash_dl.jpg'],
        capture_output=True, timeout=20
    )
    with open('/tmp/unsplash_dl.jpg', 'rb') as f:
        image_data = f.read()
    print(f"  Downloaded: {len(image_data)} bytes")

    # 3. Track download (Unsplash requirement)
    try:
        subprocess.run(
            ['curl', '-s', photo['links']['download_location'], '-H', f'Authorization: Client-ID {UNSPLASH_KEY}'],
            capture_output=True, timeout=5
        )
    except:
        pass

    # 4. Upload to Supabase Storage
    storage_path = f"{city}/{slug}/unsplash-{photo_id}.jpg"
    upload_url = f"{SUPABASE_URL}/storage/v1/object/neighborhood-images/{storage_path}"

    upload_req = urllib.request.Request(
        upload_url,
        data=image_data,
        method='POST',
        headers={
            'Authorization': f'Bearer {SUPABASE_KEY}',
            'Content-Type': 'image/jpeg',
            'x-upsert': 'true',
        }
    )

    try:
        with urllib.request.urlopen(upload_req, timeout=30) as resp:
            upload_result = json.loads(resp.read())
        print(f"  Uploaded to storage: {storage_path}")
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"  Upload error: {e.code} - {body}")
        continue

    # 5. Public URL
    public_url = f"{SUPABASE_URL}/storage/v1/object/public/neighborhood-images/{storage_path}"

    # 6. Upsert to DB
    attribution = f"Photo by {photographer} on Unsplash"
    db_url = f"{SUPABASE_URL}/rest/v1/neighborhood_images"
    db_data = json.dumps({
        'city': city,
        'neighborhood_slug': slug,
        'provider': 'unsplash',
        'provider_id': photo_id,
        'storage_path': storage_path,
        'public_url': public_url,
        'source_url': source_url,
        'photographer': photographer,
        'photographer_url': photographer_url,
        'attribution_text': attribution,
        'width': width,
        'height': height,
        'is_active': True,
        'quality_score': 75,
        'metadata': json.dumps({
            'likes': photo.get('likes', 0),
            'description': desc,
        }),
    }).encode()

    db_req = urllib.request.Request(
        db_url,
        data=db_data,
        method='POST',
        headers={
            'Authorization': f'Bearer {SUPABASE_KEY}',
            'apikey': SUPABASE_KEY,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates',
        }
    )

    try:
        with urllib.request.urlopen(db_req, timeout=10) as resp:
            print(f"  DB upsert OK")
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"  DB error: {e.code} - {body}")
        continue

    # 7. Deactivate other images for this slug
    deactivate_url = f"{SUPABASE_URL}/rest/v1/neighborhood_images?city=eq.{city}&neighborhood_slug=eq.{slug}&provider_id=neq.{photo_id}"
    deact_data = json.dumps({'is_active': False}).encode()
    deact_req = urllib.request.Request(
        deactivate_url,
        data=deact_data,
        method='PATCH',
        headers={
            'Authorization': f'Bearer {SUPABASE_KEY}',
            'apikey': SUPABASE_KEY,
            'Content-Type': 'application/json',
        }
    )
    try:
        urllib.request.urlopen(deact_req, timeout=5)
    except:
        pass

    print(f"  DONE: {public_url}")
    time.sleep(1)

print("\n=== ALL DONE ===")
