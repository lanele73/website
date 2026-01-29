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

    openLightbox(index) {
        this.currentIndex = index;
        const item = this.galleryItems[index];
        const fullImageSrc = item.getAttribute('data-src');
        const alt = item.querySelector('img').getAttribute('alt');

        this.lightboxImg.src = fullImageSrc;
        this.caption.textContent = alt;
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
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
        const alt = item.querySelector('img').getAttribute('alt');

        this.lightboxImg.src = fullImageSrc;
        this.caption.textContent = alt;
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
