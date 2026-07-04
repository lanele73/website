const CLOUDINARY_THUMB_TRANSFORMS = 'f_auto,q_auto,w_1200,h_1400,c_limit';
const CLOUDINARY_FULL_TRANSFORMS = 'f_auto,q_auto,w_2200,h_1600,c_limit';
const PATCHWORK_MIN_ROW_SPAN = 10;
const PATCHWORK_MAX_ROW_SPAN = 90;

function getMinimumRowSpan(aspectRatio) {
    if (aspectRatio >= 2.6) {
        return 4;
    }

    if (aspectRatio >= 1.9) {
        return 6;
    }

    if (aspectRatio >= 1.35) {
        return 8;
    }

    return PATCHWORK_MIN_ROW_SPAN;
}

function buildCloudinaryUrl(publicId, transforms) {
    const encodedPublicId = publicId
        .split('/')
        .map(segment => encodeURIComponent(segment))
        .join('/');

    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transforms}/${encodedPublicId}`;
}

function shufflePhotos(items) {
    const shuffled = [...items];

    for (let i = shuffled.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

function renderGallery() {
    const gallery = document.getElementById('gallery');

    if (!gallery) {
        return;
    }

    if (!Array.isArray(photos) || photos.length === 0) {
        gallery.innerHTML = '<p>No photos configured yet.</p>';
        return;
    }

    const randomizedPhotos = shufflePhotos(photos);

    gallery.innerHTML = randomizedPhotos.map(({ publicId, title }) => {
        const thumbnailSrc = buildCloudinaryUrl(publicId, CLOUDINARY_THUMB_TRANSFORMS);
        const fullImageSrc = buildCloudinaryUrl(publicId, CLOUDINARY_FULL_TRANSFORMS);
        const safeTitle = title ?? '';

        return `
            <div class="gallery-item" data-src="${fullImageSrc}">
                <img src="${thumbnailSrc}" alt="${safeTitle}" loading="lazy" decoding="async">
            </div>
        `;
    }).join('');
}

function layoutGalleryItem(item) {
    const image = item.querySelector('img');

    if (!image || !image.naturalWidth || !image.naturalHeight) {
        return;
    }

    const gallery = item.parentElement;

    if (!gallery) {
        return;
    }

    const aspectRatio = image.naturalWidth / image.naturalHeight;

    item.style.setProperty('--col-span', '1');
    item.dataset.orientation = aspectRatio > 1.15 ? 'landscape' : aspectRatio < 0.85 ? 'portrait' : 'square';

    requestAnimationFrame(() => {
        const galleryStyles = window.getComputedStyle(gallery);
        const rowHeight = parseFloat(galleryStyles.getPropertyValue('grid-auto-rows'));
        const rowGap = parseFloat(galleryStyles.getPropertyValue('gap'));
        const itemWidth = item.getBoundingClientRect().width;

        if (!rowHeight || !itemWidth) {
            return;
        }

        const borderAdjustment = 2;
        const expectedCardHeight = (itemWidth / aspectRatio) + borderAdjustment;
        const minimumRowSpan = getMinimumRowSpan(aspectRatio);

        const rowSpan = Math.max(
            minimumRowSpan,
            Math.min(
                PATCHWORK_MAX_ROW_SPAN,
                Math.ceil((expectedCardHeight + rowGap) / (rowHeight + rowGap))
            )
        );

        item.style.setProperty('--row-span', String(rowSpan));
    });
}

function layoutGalleryItems() {
    document.querySelectorAll('.gallery-item').forEach(layoutGalleryItem);
}

function initializePatchworkLayout() {
    const galleryImages = document.querySelectorAll('.gallery-item img');

    galleryImages.forEach(image => {
        const item = image.closest('.gallery-item');

        if (!item) {
            return;
        }

        if (image.complete) {
            layoutGalleryItem(item);
            return;
        }

        image.addEventListener('load', () => layoutGalleryItem(item), { once: true });
    });

    window.addEventListener('resize', () => {
        window.requestAnimationFrame(layoutGalleryItems);
    });
}

// Lightbox functionality
class PhotoGallery {
    constructor() {
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImg = document.getElementById('lightbox-img');
        this.caption = document.getElementById('caption');
        this.galleryItems = document.querySelectorAll('.gallery-item');
        this.currentIndex = 0;
        
        this.init();
    }

    init() {
        // Add click listeners to gallery items
        this.galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => this.openLightbox(index));
        });

        // Close button
        document.querySelector('.close').addEventListener('click', () => this.closeLightbox());

        // Navigation
        document.querySelector('.prev').addEventListener('click', () => this.prevImage());
        document.querySelector('.next').addEventListener('click', () => this.nextImage());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Close on background click
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) {
                this.closeLightbox();
            }
        });

        // Touch support for mobile
        this.addTouchSupport();
    }

    clearSelectedItem() {
        this.galleryItems.forEach(item => item.classList.remove('is-selected'));
    }

    setSelectedItem(index) {
        this.clearSelectedItem();
        const selectedItem = this.galleryItems[index];

        if (selectedItem) {
            selectedItem.classList.add('is-selected');
        }
    }

    openLightbox(index) {
        this.currentIndex = index;
        const item = this.galleryItems[index];
        const fullImageSrc = item.getAttribute('data-src');

        this.setSelectedItem(index);
        this.lightboxImg.src = fullImageSrc;
        this.caption.textContent = '';
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
        this.clearSelectedItem();
    }

    nextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.galleryItems.length;
        this.updateLightboxImage();
    }

    prevImage() {
        this.currentIndex = (this.currentIndex - 1 + this.galleryItems.length) % this.galleryItems.length;
        this.updateLightboxImage();
    }

    updateLightboxImage() {
        const item = this.galleryItems[this.currentIndex];
        const fullImageSrc = item.getAttribute('data-src');

        this.setSelectedItem(this.currentIndex);
        this.lightboxImg.src = fullImageSrc;
        this.caption.textContent = '';
    }

    handleKeyboard(e) {
        if (!this.lightbox.classList.contains('active')) return;

        switch(e.key) {
            case 'Escape':
                this.closeLightbox();
                break;
            case 'ArrowRight':
                this.nextImage();
                break;
            case 'ArrowLeft':
                this.prevImage();
                break;
        }
    }

    addTouchSupport() {
        let touchStartX = 0;
        let touchEndX = 0;

        this.lightboxImg.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);

        this.lightboxImg.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, false);

        const handleSwipe = () => {
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) {
                this.nextImage();
            }
            if (touchEndX > touchStartX + swipeThreshold) {
                this.prevImage();
            }
        };

        this.handleSwipe = handleSwipe;
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    renderGallery();
    initializePatchworkLayout();
    new PhotoGallery();
});

// Preload images for better performance
function preloadImages() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        const fullImageSrc = item.getAttribute('data-src');
        const img = new Image();
        img.src = fullImageSrc;
    });
}

// Start preloading after a short delay to prioritize initial page load
setTimeout(preloadImages, 1000);
