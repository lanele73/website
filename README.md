# Photography Portfolio Website

A simple, elegant photography portfolio website designed for GitHub Pages. Features high-quality image rendering and mobile-responsive design.

## 🚀 Quick Start

### 1. Add Your Photos

Export your photos from Lightroom and add them to the `images` folder:
- **Full-size images**: `images/full/` 
- **Thumbnails**: `images/thumbs/`

### 2. Update the Gallery

Edit `index.html` and add/modify gallery items:

```html
<div class="gallery-item" data-src="images/full/your-photo.jpg">
    <img src="images/thumbs/your-photo.jpg" alt="Description" loading="lazy">
</div>
```

### 3. Deploy to GitHub Pages

1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Select "main" branch as source
4. Your site will be live at `https://yourusername.github.io/repository-name`

## 📸 Lightroom Export Settings (Recommended)

### For Full-Size Images (`images/full/`)

**File Settings:**
- Format: JPEG
- Quality: 90-95
- Color Space: sRGB
- Limit File Size: Optional (2-4 MB for web)

**Image Sizing:**
- Resize to Fit: Long Edge
- Dimension: 2400-3000 pixels
- Resolution: 72 ppi (web standard)

**Output Sharpening:**
- Sharpen For: Screen
- Amount: Standard

**Metadata:**
- Remove location info (for privacy)
- Include copyright (optional)

### For Thumbnails (`images/thumbs/`)

**File Settings:**
- Format: JPEG
- Quality: 85
- Color Space: sRGB

**Image Sizing:**
- Resize to Fit: Long Edge
- Dimension: 800 pixels
- Resolution: 72 ppi

**Output Sharpening:**
- Sharpen For: Screen
- Amount: Standard

### Alternative: Automated Lightroom Export

You can create two export presets in Lightroom:
1. **"Web - Full Size"** with the full-size settings above
2. **"Web - Thumbnails"** with the thumbnail settings above

Then export each photo twice using these presets.

## 🎨 Customization

### Change Colors

Edit the CSS variables in `style.css`:

```css
:root {
    --background: #0a0a0a;
    --text: #f5f5f5;
    --accent: #ffffff;
    --overlay: rgba(0, 0, 0, 0.95);
}
```

### Change Grid Layout

Modify the grid in `style.css`:

```css
.gallery {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
}
```

### Update Site Title

Edit `index.html`:

```html
<header>
    <h1>Your Name</h1>
    <p class="subtitle">Photographer</p>
</header>
```

## ✨ Features

- **Responsive Grid**: Automatically adjusts to screen size
- **Lightbox Gallery**: Click any image to view full-size
- **Keyboard Navigation**: Use arrow keys to navigate, ESC to close
- **Touch Support**: Swipe to navigate on mobile devices
- **Lazy Loading**: Images load as you scroll for better performance
- **High-Quality Rendering**: Optimized for crisp, clear photos
- **No Dependencies**: Pure HTML, CSS, and JavaScript

## 📱 Mobile-Friendly

The site is fully responsive and optimized for:
- Desktop browsers
- Tablets
- Mobile phones
- Touch interfaces

## 🌐 Browser Support

Works on all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## 📁 Project Structure

```
website/
├── index.html          # Main HTML file
├── style.css           # All styles
├── script.js           # Gallery functionality
├── images/
│   ├── full/          # Full-resolution images
│   └── thumbs/        # Thumbnail images
└── README.md          # This file
```

## 💡 Tips

1. **Keep file sizes reasonable**: 2-4 MB for full images, under 200 KB for thumbs
2. **Use consistent naming**: photo1.jpg, photo2.jpg, etc.
3. **Maintain aspect ratios**: The grid looks best with similar aspect ratios
4. **Test on mobile**: Always check how your site looks on phone screens
5. **Use descriptive alt text**: Good for accessibility and SEO

## 🔧 Advanced: Image Optimization Script

For batch processing, you can use ImageMagick to create thumbnails:

```bash
# Install ImageMagick (macOS)
brew install imagemagick

# Create thumbnails from full-size images
cd images/full
for img in *.jpg; do
    convert "$img" -resize 800x800\> -quality 85 ../thumbs/"$img"
done
```

## 📄 License

Free to use for your personal portfolio. Modify as needed!

---

**Need help?** The code is simple and well-commented. Check the individual files for more details.
