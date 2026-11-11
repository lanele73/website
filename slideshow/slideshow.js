const SLIDE_DURATION_MS = 10000;
const CONTROL_HIDE_DELAY_MS = 4000;
const FULL_IMAGE_TRANSFORMS = 'f_auto,q_auto:best,w_3840,h_2160,c_limit';

const photoElement = document.getElementById('photo');
const statusElement = document.getElementById('status');
const controlsElement = document.querySelector('.controls');
const toggleButton = document.getElementById('toggle');
const fullscreenButton = document.getElementById('fullscreen');

let orderedPhotos = Array.isArray(photos) ? [...photos] : [];
let currentIndex = 0;
let advanceTimer = null;
let controlsTimer = null;
let isPlaying = true;

function buildPhotoUrl(publicId) {
    const encodedId = publicId
        .split('/')
        .map(segment => encodeURIComponent(segment))
        .join('/');

    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${FULL_IMAGE_TRANSFORMS}/${encodedId}`;
}

function shuffle(items) {
    for (let index = items.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [items[index], items[randomIndex]] = [items[randomIndex], items[index]];
    }
    return items;
}

function formatPhotoAlt(photo) {
    return [photo.title, photo.location]
        .map(part => part?.trim())
        .filter(Boolean)
        .join(' \u2022 ');
}

function clearAdvanceTimer() {
    if (advanceTimer !== null) {
        window.clearTimeout(advanceTimer);
        advanceTimer = null;
    }
}

function scheduleNextPhoto() {
    clearAdvanceTimer();
    if (isPlaying && orderedPhotos.length > 1) {
        advanceTimer = window.setTimeout(() => showPhoto(currentIndex + 1), SLIDE_DURATION_MS);
    }
}

function showPhoto(index) {
    if (!orderedPhotos.length) {
        statusElement.textContent = 'No photos configured.';
        return;
    }

    currentIndex = (index + orderedPhotos.length) % orderedPhotos.length;
    const photo = orderedPhotos[currentIndex];
    photoElement.alt = formatPhotoAlt(photo);
    statusElement.textContent = '';
    photoElement.onload = scheduleNextPhoto;
    photoElement.onerror = () => {
        statusElement.textContent = 'This photo could not be loaded.';
        scheduleNextPhoto();
    };
    photoElement.src = buildPhotoUrl(photo.publicId);
    if (photoElement.complete && photoElement.naturalWidth) {
        scheduleNextPhoto();
    }
}

function setPlaying(playing) {
    isPlaying = playing;
    toggleButton.textContent = playing ? 'Pause' : 'Play';
    toggleButton.setAttribute('aria-label', playing ? 'Pause slideshow' : 'Play slideshow');
    toggleButton.title = playing ? 'Pause slideshow' : 'Play slideshow';
    if (playing) {
        scheduleNextPhoto();
    } else {
        clearAdvanceTimer();
    }
}

function revealControls() {
    controlsElement.classList.remove('is-hidden');
    window.clearTimeout(controlsTimer);
    controlsTimer = window.setTimeout(() => {
        controlsElement.classList.add('is-hidden');
    }, CONTROL_HIDE_DELAY_MS);
}

async function toggleFullscreen() {
    try {
        if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
        } else if (document.fullscreenElement && document.exitFullscreen) {
            await document.exitFullscreen();
        } else {
            statusElement.textContent = 'Use the TV browser menu to enter fullscreen.';
        }
    } catch {
        statusElement.textContent = 'Use the TV browser menu to enter fullscreen.';
    }
    revealControls();
}

document.getElementById('previous').addEventListener('click', () => showPhoto(currentIndex - 1));
document.getElementById('next').addEventListener('click', () => showPhoto(currentIndex + 1));
toggleButton.addEventListener('click', () => setPlaying(!isPlaying));
fullscreenButton.addEventListener('click', toggleFullscreen);

document.addEventListener('keydown', event => {
    revealControls();
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        showPhoto(currentIndex + 1);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        showPhoto(currentIndex - 1);
    } else if (event.key === ' ' || event.key === 'Enter') {
        if (event.target === document.body || event.target === photoElement) {
            event.preventDefault();
            setPlaying(!isPlaying);
        }
    } else if (event.key.toLowerCase() === 'f') {
        toggleFullscreen();
    }
});

document.addEventListener('pointermove', revealControls);
document.addEventListener('fullscreenchange', () => {
    const inFullscreen = Boolean(document.fullscreenElement);
    fullscreenButton.textContent = inFullscreen ? 'Exit fullscreen' : 'Fullscreen';
    fullscreenButton.setAttribute('aria-label', inFullscreen ? 'Exit fullscreen' : 'Enter fullscreen');
    fullscreenButton.title = inFullscreen ? 'Exit fullscreen' : 'Enter fullscreen';
});

if (RANDOMIZE_PHOTO_ORDER) {
    shuffle(orderedPhotos);
}

if (orderedPhotos.length) {
    showPhoto(0);
} else {
    statusElement.textContent = 'No photos configured.';
}

revealControls();