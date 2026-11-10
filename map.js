const MAPLIBRE_BASE_URL = 'https://unpkg.com/maplibre-gl@5.6.1/dist';
let mapLibraryLoadPromise;

function loadMapLibrary() {
    if (mapLibraryLoadPromise) {
        return mapLibraryLoadPromise;
    }

    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = `${MAPLIBRE_BASE_URL}/maplibre-gl.css`;
    stylesheet.integrity = 'sha256-eSrJl9z2rm9kPrTi3uRjDIXnBWUmvY+4X/6Dxn1sQbQ=';
    stylesheet.crossOrigin = 'anonymous';

    const script = document.createElement('script');
    script.src = `${MAPLIBRE_BASE_URL}/maplibre-gl.js`;
    script.integrity = 'sha256-taNOaTD/k327ue7IiSz/uAukc8zoiuXKjEZUQy9fDrw=';
    script.crossOrigin = 'anonymous';

    mapLibraryLoadPromise = Promise.all([
        new Promise((resolve, reject) => {
            stylesheet.onload = resolve;
            stylesheet.onerror = () => reject(new Error('Map stylesheet could not be loaded.'));
            document.head.append(stylesheet);
        }),
        new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = () => reject(new Error('Map script could not be loaded.'));
            document.head.append(script);
        })
    ]).catch(error => {
        stylesheet.remove();
        script.remove();
        mapLibraryLoadPromise = null;
        throw error;
    });

    return mapLibraryLoadPromise;
}

function createPhotoMapStyle() {
    return {
        version: 8,
        sources: {
            geography: {
                type: 'vector',
                url: 'https://tiles.openfreemap.org/planet',
                attribution: '<a href="https://openfreemap.org/">OpenFreeMap</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            },
            elevation: {
                type: 'raster-dem',
                tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
                tileSize: 256,
                maxzoom: 15,
                encoding: 'terrarium',
                attribution: '<a href="https://github.com/tilezen/joerd/blob/master/docs/attribution.md">Terrain data sources</a>'
            }
        },
        layers: [
            { id: 'land', type: 'background', paint: { 'background-color': '#303030' } },
            {
                id: 'relief',
                type: 'hillshade',
                source: 'elevation',
                minzoom: 4,
                paint: {
                    'hillshade-exaggeration': 0.2,
                    'hillshade-shadow-color': 'rgba(0, 0, 0, 0.3)',
                    'hillshade-highlight-color': 'rgba(255, 255, 255, 0.15)',
                    'hillshade-accent-color': 'rgba(0, 0, 0, 0.15)'
                }
            },
            {
                id: 'water',
                type: 'fill',
                source: 'geography',
                'source-layer': 'water',
                filter: ['!=', ['get', 'brunnel'], 'tunnel'],
                paint: { 'fill-color': '#141414' }
            },
            {
                id: 'waterways',
                type: 'line',
                source: 'geography',
                'source-layer': 'waterway',
                minzoom: 8,
                paint: { 'line-color': '#141414', 'line-width': 1 }
            },
            {
                id: 'country-borders',
                type: 'line',
                source: 'geography',
                'source-layer': 'boundary',
                filter: ['all', ['==', ['get', 'admin_level'], 2], ['!=', ['get', 'maritime'], 1]],
                paint: {
                    'line-color': '#777777',
                    'line-opacity': 0.55,
                    'line-width': ['interpolate', ['linear'], ['zoom'], 0, 0.5, 8, 1],
                    'line-dasharray': [3, 2]
                }
            }
        ]
    };
}

function hasPhotoCoordinates(photo) {
    return Array.isArray(photo.coordinates)
        && photo.coordinates.length === 2
        && Number.isFinite(photo.coordinates[0])
        && Number.isFinite(photo.coordinates[1])
        && Math.abs(photo.coordinates[0]) <= 90
        && Math.abs(photo.coordinates[1]) <= 180;
}

class PhotoMap {
    constructor(gallery) {
        this.gallery = gallery;
        this.map = null;
        this.loading = false;
        this.panel = document.getElementById('map-panel');
        this.status = document.getElementById('map-status');
        this.retry = document.getElementById('map-retry');
        this.photosButton = document.getElementById('photos-view');
        this.mapButton = document.getElementById('map-view');

        this.photosButton.addEventListener('click', () => this.setView(false));
        this.mapButton.addEventListener('click', () => this.setView(true));
        this.retry.addEventListener('click', () => this.initialize());
    }

    setView(showMap) {
        document.body.classList.toggle('map-view-active', showMap);
        this.panel.hidden = !showMap;
        document.getElementById('gallery').hidden = showMap;
        this.gallery.playButton.hidden = showMap;
        this.photosButton.setAttribute('aria-pressed', String(!showMap));
        this.mapButton.setAttribute('aria-pressed', String(showMap));

        if (showMap) {
            if (this.map) {
                this.map.resize();
            } else {
                this.initialize();
            }
        } else {
            layoutGalleryItems();
        }
    }

    async initialize() {
        if (this.loading) {
            return;
        }
        if (this.map) {
            this.map.remove();
            this.map = null;
        }

        this.loading = true;
        this.retry.hidden = true;
        this.status.textContent = 'Loading map...';
        this.panel.setAttribute('aria-busy', 'true');

        try {
            await loadMapLibrary();
            if (!this.panel.hidden) {
                this.createMap();
            }
        } catch (error) {
            console.error('Unable to initialize the photo map.', error);
            if (this.map) {
                this.map.remove();
                this.map = null;
            }
            this.status.textContent = 'The map could not be loaded. Check your connection and try again.';
            this.retry.hidden = false;
        } finally {
            this.loading = false;
            this.panel.removeAttribute('aria-busy');
        }
    }

    createMap() {
        const locatedPhotos = photos.filter(hasPhotoCoordinates);
        const invalidPhotos = photos.filter(photo => photo.coordinates != null && !hasPhotoCoordinates(photo));
        if (invalidPhotos.length) {
            console.error('Invalid photo coordinates; expected [latitude, longitude].', invalidPhotos.map(photo => photo.publicId));
        }

        let summary = locatedPhotos.length ? '' : 'No photo locations added yet.';
        if (invalidPhotos.length) {
            summary += ` ${invalidPhotos.length} ${invalidPhotos.length === 1 ? 'entry has' : 'entries have'} invalid coordinates.`;
        }
        this.status.textContent = summary.trim();

        this.map = new maplibregl.Map({
            container: 'photo-map',
            style: createPhotoMapStyle(),
            center: [0, 20],
            zoom: Math.log2(Math.max(this.panel.clientWidth, this.panel.clientHeight) / 512),
            minZoom: 0,
            maxZoom: 16,
            renderWorldCopies: false,
            dragRotate: false,
            pitchWithRotate: false,
            attributionControl: false
        });
        this.map.touchZoomRotate.disableRotation();
        this.map.addControl(new maplibregl.AttributionControl({ compact: false }), 'bottom-right');
        this.map.on('error', event => {
            console.error('Unable to load photo map data.', event.error);
            this.status.textContent = `${summary} Map detail could not be loaded. Check your connection and retry.`.trim();
            this.retry.hidden = false;
        });

        const spots = new Map();
        locatedPhotos.forEach(photo => {
            const key = photo.coordinates.join(',');
            if (!spots.has(key)) {
                spots.set(key, []);
            }
            spots.get(key).push(photo);
        });

        spots.forEach(spotPhotos => {
            const count = spotPhotos.length;
            const label = count === 1
                ? formatPhotoCaption(spotPhotos[0].title, spotPhotos[0].location)
                : `${count} photos at this location`;
            const element = document.createElement('button');
            element.type = 'button';
            element.className = 'photo-map-marker';
            element.title = label;
            element.setAttribute('aria-label', label);
            const dot = document.createElement('span');
            dot.textContent = count > 1 ? String(count) : '';
            element.append(dot);
            const [latitude, longitude] = spotPhotos[0].coordinates;
            const content = this.createPopup(spotPhotos);
            const popup = new maplibregl.Popup({
                offset: 14,
                maxWidth: 'none',
                className: 'photo-map-popup',
                closeButton: false
            })
                .setDOMContent(content);
            content.addEventListener('load', () => {
                if (popup.isOpen()) {
                    popup.setMaxWidth('none');
                }
            }, true);
            const closeOnEscape = event => {
                if (event.key === 'Escape' && !this.gallery.lightbox.classList.contains('active')) {
                    event.stopPropagation();
                    popup.remove();
                }
            };
            content.addEventListener('keydown', closeOnEscape);
            element.addEventListener('keydown', closeOnEscape);
            const marker = new maplibregl.Marker({ element })
                .setLngLat([longitude, latitude])
                .setPopup(popup)
                .addTo(this.map);
            popup.on('close', () => element.focus());
            element.addEventListener('keydown', event => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    marker.togglePopup();
                }
            });
        });

        if (locatedPhotos.length) {
            const bounds = new maplibregl.LngLatBounds();
            locatedPhotos.forEach(photo => bounds.extend([photo.coordinates[1], photo.coordinates[0]]));
            this.map.fitBounds(bounds, {
                padding: 48,
                maxZoom: locatedPhotos.length === 1 ? 7 : 12,
                duration: 0
            });
        }
    }

    createPopup(spotPhotos) {
        const container = document.createElement('div');
        container.className = 'map-photo-list';

        spotPhotos.forEach(photo => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'map-photo';
            const caption = formatPhotoCaption(photo.title, photo.location);
            button.setAttribute('aria-label', `Open photo: ${caption}`);

            const image = document.createElement('img');
            image.src = buildCloudinaryUrl(photo.publicId, 'f_auto,q_auto:good,w_1680,h_1440,c_limit');
            image.alt = '';
            image.loading = 'lazy';
            const text = document.createElement('span');
            text.textContent = caption;
            button.append(image, text);
            button.addEventListener('click', () => this.gallery.openPhotoById(photo.publicId));
            container.append(button);
        });

        return container;
    }
}
