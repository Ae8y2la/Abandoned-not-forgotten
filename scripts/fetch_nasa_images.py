import urllib.request
import urllib.parse
import json
import os
from PIL import Image

OUT_DIR = os.path.join(os.getcwd(), "public", "assets", "nasa")
os.makedirs(OUT_DIR, exist_ok=True)

targets = [
    {
        "nasa_id": "as15-88-11866",
        "key": "apollo15_rover_irwin",
        "type": "photograph",
        "title": "Astronaut James Irwin with Lunar Roving Vehicle at Hadley-Apennine",
        "credit": "NASA / Apollo 15 Crew",
        "alt": "Astronaut James Irwin salutes beside the U.S. flag and Lunar Roving Vehicle on the lunar surface, with Mons Hadley in the background."
    },
    {
        "nasa_id": "as15-86-11603",
        "key": "apollo15_rover_work",
        "type": "photograph",
        "title": "Astronaut Working at the Lunar Roving Vehicle during Apollo 15 EVA",
        "credit": "NASA / Apollo 15 Crew",
        "alt": "Astronaut James Irwin works at the Lunar Roving Vehicle, showing the wire-mesh tires and lunar surface equipment."
    },
    {
        "nasa_id": "PIA18079",
        "key": "opportunity_self_portrait",
        "type": "photograph",
        "title": "Self-Portrait by Opportunity Mars Rover on Endeavour Crater Rim",
        "credit": "NASA / JPL-Caltech / Cornell Univ. / Arizona State Univ.",
        "alt": "Self-portrait mosaic of the Opportunity Mars exploration rover showing its solar panels and panoramic camera on the rim of Endeavour Crater."
    },
    {
        "nasa_id": "PIA05273",
        "key": "opportunity_blueberries",
        "type": "photograph",
        "title": "Hematite Spherules ('Blueberries') in Martian Soil",
        "credit": "NASA / JPL-Caltech / USGS",
        "alt": "Extreme close-up mosaic from Opportunity's Microscopic Imager showing spherical hematite concretions embedded in the Martian soil."
    },
    {
        "nasa_id": "PIA23246",
        "key": "opportunity_perseverance_valley",
        "type": "photograph",
        "title": "Opportunity's Tracks in Perseverance Valley",
        "credit": "NASA / JPL-Caltech",
        "alt": "Navcam mosaic showing Opportunity rover wheel tracks leading into Perseverance Valley on Mars."
    },
    {
        "nasa_id": "PIA17049",
        "key": "voyager1_spacecraft",
        "type": "illustration",
        "title": "Voyager 1 Crossing into Interstellar Space (Artist Concept)",
        "credit": "NASA / JPL-Caltech",
        "alt": "Artist concept illustration of NASA's Voyager 1 spacecraft with its 3.7-meter high-gain antenna, traversing the boundary of interstellar space."
    }
]

def fetch_asset_links(nasa_id):
    manifest_url = f"https://images-api.nasa.gov/asset/{urllib.parse.quote(nasa_id)}"
    req = urllib.request.Request(manifest_url, headers={"User-Agent": "NASA-SpaceApps/1.0"})
    with urllib.request.urlopen(req, timeout=12) as resp:
        links = json.loads(resp.read().decode())["collection"]["items"]
        hrefs = [item["href"] for item in links]
        # Prefer ~large.jpg or ~medium.jpg to avoid 80MB ~orig.jpg timeouts
        preferred = next((h for h in hrefs if "~large.jpg" in h), None)
        if not preferred:
            preferred = next((h for h in hrefs if "~medium.jpg" in h), None)
        if not preferred:
            preferred = next((h for h in hrefs if h.endswith(".jpg") and "~thumb" not in h), hrefs[0])
        return preferred

records = []

for t in targets:
    print(f"Fetching links for NASA ID: {t['nasa_id']}...")
    try:
        img_url = fetch_asset_links(t["nasa_id"])
        print(f"Selected URL: {img_url}")
        
        raw_filename = f"{t['key']}_temp.jpg"
        raw_path = os.path.join(OUT_DIR, raw_filename)
        
        req = urllib.request.Request(img_url, headers={"User-Agent": "NASA-SpaceApps/1.0"})
        with urllib.request.urlopen(req, timeout=25) as resp, open(raw_path, "wb") as f:
            f.write(resp.read())
        
        with Image.open(raw_path) as im:
            im = im.convert("RGB")
            w, h = im.size
            
            # Hero WebP (max 1920px wide)
            hero_w = min(1920, w)
            hero_h = int(h * (hero_w / w))
            im_hero = im.resize((hero_w, hero_h), Image.Resampling.LANCZOS)
            hero_name = f"{t['key']}_1920.webp"
            hero_path = os.path.join(OUT_DIR, hero_name)
            im_hero.save(hero_path, "WEBP", quality=82, method=6)
            hero_kb = os.path.getsize(hero_path) / 1024
            
            # Small WebP (max 800px wide)
            small_w = min(800, w)
            small_h = int(h * (small_w / w))
            im_small = im.resize((small_w, small_h), Image.Resampling.LANCZOS)
            small_name = f"{t['key']}_800.webp"
            small_path = os.path.join(OUT_DIR, small_name)
            im_small.save(small_path, "WEBP", quality=80, method=6)
            small_kb = os.path.getsize(small_path) / 1024
            
            records.append({
                "key": t["key"],
                "nasa_id": t["nasa_id"],
                "title": t["title"],
                "type": t["type"],
                "credit": t["credit"],
                "alt": t["alt"],
                "detail_page": f"https://images.nasa.gov/details-{t['nasa_id']}",
                "hero_url": f"/assets/nasa/{hero_name}",
                "small_url": f"/assets/nasa/{small_name}",
                "hero_w": hero_w,
                "hero_h": hero_h,
                "small_w": small_w,
                "small_h": small_h,
                "hero_size_kb": round(hero_kb, 1),
                "small_size_kb": round(small_kb, 1)
            })
            print(f"-> Saved: {hero_name} ({hero_kb:.1f} KB), {small_name} ({small_kb:.1f} KB)")
            
        if os.path.exists(raw_path):
            os.remove(raw_path)
            
    except Exception as e:
        print(f"Error processing {t['nasa_id']}: {e}")

# Save JSON manifest
manifest_path = os.path.join(OUT_DIR, "images_manifest.json")
with open(manifest_path, "w") as f:
    json.dump(records, f, indent=2)

print(f"\nSuccessfully downloaded and processed {len(records)} authentic NASA assets!")
