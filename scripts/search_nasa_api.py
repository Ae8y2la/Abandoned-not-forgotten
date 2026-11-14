import urllib.request
import urllib.parse
import json

queries = [
    'Opportunity blueberries microscopic',
    'Opportunity blueberries',
    'Opportunity Perseverance Valley',
    'Opportunity rover self-portrait',
    'Opportunity rover',
    'Apollo 15 Lunar Roving Vehicle',
    'Apollo 15 LRV Station',
    'Voyager 1'
]

for q in queries:
    url = f"https://images-api.nasa.gov/search?q={urllib.parse.quote(q)}&media_type=image"
    req = urllib.request.Request(url, headers={"User-Agent": "NASA-SpaceApps/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=12) as resp:
            items = json.loads(resp.read().decode())['collection']['items']
            print(f"\n=== Results for: '{q}' ({len(items)} found) ===")
            for it in items[:4]:
                d = it['data'][0]
                print(f"ID: {d.get('nasa_id')} | Title: {d.get('title')}")
                desc = d.get('description', '')[:90].replace('\n', ' ')
                print(f"   Desc: {desc}...")
    except Exception as e:
        print(f"Error for '{q}': {e}")
