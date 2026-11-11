# Photography Portfolio Website

A simple, elegant photography portfolio designed for GitHub Pages. Images are delivered from [Cloudinary](https://cloudinary.com/) so the repository stays small; the gallery is driven by `photos.js` and `script.js`.

## Quick start

### 1. Cloudinary

1. Create a [Cloudinary](https://cloudinary.com/) account if you have not already.
2. In the dashboard, copy your **cloud name** (not the API secret).
3. Open [photos.js](photos.js) and set `CLOUDINARY_CLOUD_NAME` to that value.

You do **not** need an API key or secret for the public site: delivery URLs only use the cloud name and each image’s **public ID**. Use the API key and secret only for uploads or server-side tools, and never commit the secret to this repo.

### 2. Upload photos

Upload your images to the Cloudinary Media Library. Use a single folder (for example `fotos`) so each asset’s public ID looks like `fotos/your-image-name`. The entries in `photos.js` must match those public IDs exactly (including any file extension if Cloudinary stored one).

### 3. Configure the gallery

Edit [photos.js](photos.js): adjust the `photos` array (`publicId` and `title`).
Set `RANDOMIZE_PHOTO_ORDER = true` to shuffle the gallery on each page load, or
`false` (currently selected for debugging) to follow the array order. There are no
capture dates in the data, so chronological display depends on keeping the array
in chronological order. Lightbox navigation follows the gallery order.

Thumbnail and lightbox sizes use Cloudinary transformations in [script.js](script.js) (`CLOUDINARY_THUMB_TRANSFORMS` and `CLOUDINARY_FULL_TRANSFORMS`).

### Photo map

The **photo-grid / folded-map** icon switch opens the gallery or a monochrome
MapLibre map. Icons retain accessible labels and hover tooltips (`fotos` / `mapa`).
The site remains static:
no backend, build step, account, or API key is required. MapLibre GL JS 5.6.1 and
its CSS load from UNPKG only when the map is first opened.
[OpenFreeMap](https://openfreemap.org/) provides OpenStreetMap-based vector tiles,
loading finer coastlines, lakes, and rivers as you zoom. A small custom style in
[map.js](map.js) draws dark land and water with thin, muted country boundaries
(excluding maritime boundaries): no labels, roads, or colorful features.
Subtle 2D hillshading appears from zoom 4 using key-free
[Terrain Tiles on AWS](https://registry.opendata.aws/terrain-tiles/).
It adds a little mountain texture without changing the map into a 3D terrain view;
water is drawn above it so oceans and lakes remain flat.
Unlike the former simplified world outline, the map loads new detail at each
available data zoom level. Zoom is capped at 16; the source's native detail is finite.

Keep the visible OpenFreeMap/OpenStreetMap and linked terrain-source attribution.
The [terrain credits and licensing](https://github.com/tilezen/joerd/blob/master/docs/attribution.md)
identify the regional elevation-data providers.
No library logo, flag,
or zoom buttons are displayed. OpenFreeMap's public service has no guaranteed SLA.
The browser must support WebGL.

In [photos.js](photos.js), replace a photo's
`coordinates: null` with `coordinates: [latitude, longitude]` using decimal degrees
(latitude first, **not** GeoJSON order). For example, `[45.5, -73.6]` describes a
point near Montreal; use the actual shooting location for your own photo.
Latitude must be between -90 and 90; longitude between -180 and 180.

Photos with missing coordinates remain in the gallery but do not get a marker.
Invalid coordinates are reported in the map status and browser console.
Coordinates are public, so leave sensitive locations unset or use an intentionally
approximate location. Until coordinates are added, the map shows a world view
with an empty-state message, not guessed locations.

Markers at identical coordinates share a popup listing their photos. Nearby but
different locations have separate markers; zoom in to distinguish them. Select a
white-bordered preview to open the existing lightbox. Previews have no close button;
click elsewhere on the map or press Escape while focused on the preview to dismiss.
Preview images use higher-resolution Cloudinary delivery and keep their original
aspect ratio, fitting the available screen space without cropping or a single-photo
scrollbar. Shared-location lists can scroll when multiple photos exceed the height limit.
The map fills the space below a compact
header, with narrow margins; the gallery layout is unchanged. With no photo
coordinates, the opening world view fills the frame, cropping its edges as needed
rather than leaving a small world in the center.
Zoom using the mouse wheel, touch gestures, or the keyboard's `+` / `-` keys
when the map is focused. On-map zoom buttons are hidden.

Open [index.html](index.html) directly in a browser, or serve the site over HTTP(S)
(for example, `python3 -m http.server 8000`). Map data loads on demand
from OpenFreeMap and AWS, so direct `file://` previews work without a local server.
An internet connection is needed for MapLibre, map tiles, and Cloudinary photos.
Loading failures show a message and retry button.

### List many photos at once (optional)

To dump `publicId` lines for [photos.js](photos.js) using the Admin API (local only — **never** commit API secrets):

1. Copy [.env.example](.env.example) to `.env` and set `CLOUDINARY_URL` (Dashboard → API Keys → “API environment variable”).
2. `npm install`
3. Run one of:

```bash
npm run list-cloudinary -- --prefix fotos/
npm run list-cloudinary -- --all
npm run list-cloudinary -- --prefix fotos/ --urls
npm run list-cloudinary -- --prefix fotos/ --json
```

`--urls` prints thumbnail delivery URLs (same transform chain as the site). Review generated titles; `--no-strip-suffix` keeps Cloudinary’s random suffix in the title hint.

### 4. Deploy to GitHub Pages

1. Push your code to GitHub.
2. Repository **Settings** → **Pages**.
3. Choose the `main` branch as the source.
4. The site will be available at `https://yourusername.github.io/repository-name`.

## Optional: preparing files before upload

If you export from Lightroom first, then upload the exports to Cloudinary, sensible defaults are JPEG, sRGB, long edge around 2400–3000px for originals, and metadata stripped for privacy if you prefer. Cloudinary applies format and quality automation in the delivery URLs (`f_auto`, `q_auto`).

## Customization

### Colors

Edit the CSS variables in `style.css`:

```css
:root {
    --background: #0a0a0a;
    --text: #f5f5f5;
    --accent: #ffffff;
    --overlay: rgba(0, 0, 0, 0.95);
}
```

### Grid layout

In `style.css`:

```css
.gallery {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
}
```

### Site title

Edit `index.html` (for example the `<h1>` in the header).

## Features

- Responsive grid, lightbox, keyboard and touch navigation, lazy loading
- No runtime npm deps for the gallery: plain HTML, CSS, and JavaScript
- Thumbnails and large views generated on the fly via Cloudinary URLs
- On-demand monochrome MapLibre/OpenFreeMap map with photo previews and optional coordinates

## Project structure

```
website/
├── index.html
├── style.css
├── script.js              # Gallery + Cloudinary URL helpers
├── map.js                 # On-demand MapLibre map + photo/lightbox integration
├── photos.js              # Cloud name + photo list, captions, optional coordinates
├── slideshow/
│   ├── index.html          # Standalone TV slideshow
│   ├── slideshow.css
│   └── slideshow.js
├── scripts/
│   └── list-cloudinary-photos.mjs   # npm run list-cloudinary (needs .env)
├── package.json
├── .env.example
├── images/
│   ├── full/
│   └── thumbs/
└── README.md
```

## License

Free to use for your personal portfolio. Modify as needed.
