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

Edit [photos.js](photos.js): adjust the `photos` array (`publicId` and `title`). Order in the array is the order on the page.

Thumbnail and lightbox sizes use Cloudinary transformations in [script.js](script.js) (`CLOUDINARY_THUMB_TRANSFORMS` and `CLOUDINARY_FULL_TRANSFORMS`).

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

## Project structure

```
website/
├── index.html
├── style.css
├── script.js              # Gallery + Cloudinary URL helpers
├── photos.js              # Cloud name + photo list (publicId, title)
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
