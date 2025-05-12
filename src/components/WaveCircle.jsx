import mapboxgl from "mapbox-gl";
import * as turf from "@turf/turf";
import polylabel from "polylabel";

export default class WaveCircle {
    constructor(id, speed, map, center, setting = {}) {
        this.id = id;
        this.speed = speed;
        this.map = map;
        this.center = center;
        this.color = setting.color || 'red';
        this.geoJson = setting.geoJson || null;
        this.intersectAreaSetting = setting.intersectAreaSetting || null;
        this.selectedAreaSetting = setting.selectedAreaSetting || null;
        this.selectedPointSetting = setting.selectedPointSetting || null;
        this.worker = setting.worker || null;

        this.curTime = 0;
        this.allPolygon = [];
        this.circle = null;
        this.size = 0;
        this.selecttedPoint = [];

        this.loadGeoJson();
        this.render();

        const animate = (time) => {
            if (!this.curTime) this.curTime = time;
            const deltaTime = time - this.curTime;
            if (this.circle && this.map) {
                this.circle.features[0].properties.radius = this.size;
                const source = this.map.getSource(this.id);
                if (source) source.setData(this.circle);
            }
            this.size = (deltaTime / 1000) * this.speed;
            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);

        if ((this.intersectAreaSetting || this.selectedAreaSetting || this.selectedPointSetting) && this.worker) {
            setInterval(() => {
                this.worker.postMessage({ type: 'checkHighlightArea', center: this.center, size: this.size, id: this.id });
            }, 1000);
            this.worker.addEventListener('message', (event) => {
                const data = event.data;
                const area = data.area;
                if (data.id === this.id && area.length > 0) {
                    if (this.selectedPointSetting) this.showSelectedPoint(area);
                    if (this.selectedAreaSetting) this.highlightSelectedArea(area);
                }
            });
        }
    }

    render() {
        if (!this.map) return;

        this.circle = {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: this.center
                    },
                    properties: {
                        radius: 0,
                        lat: this.center[1]
                    }
                }
            ]
        };

        if (this.map.getLayer(this.id)) {
            this.map.removeLayer(this.id);
        }

        this.map.addLayer({
            id: this.id,
            type: 'circle',
            source: {
                type: 'geojson',
                data: this.circle
            },
            paint: {
                'circle-radius': [
                    'interpolate',
                    ['exponential', 2],
                    ['zoom'],
                    0, 0,
                    22, [
                        '/',
                        ['/', ['get', 'radius'], 0.019],
                        ['cos', ['*', ['get', 'lat'], ['/', Math.PI, 180]]],
                    ],
                ],
                'circle-color': 'transparent',
                'circle-stroke-color': this.color,
                'circle-stroke-width': 1,
            }
        });
    }

    loadGeoJson() {
        if (!this.geoJson || !this.map) return;
        for (let feature of this.geoJson.features) {
            if (!feature.geometry) {
                console.log(feature);
                continue;
            }
            if (feature.geometry.type === 'Polygon') {
                this.allPolygon.push(turf.polygon(feature.geometry.coordinates, feature.properties));
            } else if (feature.geometry.type === 'MultiPolygon') {
                this.allPolygon.push(turf.multiPolygon(feature.geometry.coordinates, feature.properties));
            }
        }
        console.log('Total Polygon:', this.allPolygon.length);
    }

    highlightIntersectArea(highlightArea) {
        if (!highlightArea.length) return;

        const sourceId = 'highlight-source-' + this.id;
        const layerId = 'highlight-layer-' + this.id;

        if (this.map.getSource(sourceId)) {
            this.map.getSource(sourceId).setData({ type: "FeatureCollection", features: highlightArea });
        } else {
            this.map.addSource(sourceId, {
                type: 'geojson',
                data: { type: "FeatureCollection", features: highlightArea }
            });
        }

        if (!this.map.getLayer(layerId)) {
            this.map.addLayer({
                id: layerId,
                type: 'fill',
                source: sourceId,
                paint: {
                    'fill-color': this.intersectAreaSetting?.color || 'red',
                    'fill-opacity': this.intersectAreaSetting?.opacity || 0.7
                }
            });
            this.map.moveLayer('outline');
            this.map.moveLayer(this.id);
        }
    }

    highlightSelectedArea(highlightArea) {
        if (!highlightArea.length) return;

        const sourceId = 'selected-source-' + this.id;
        const layerId = 'selected-layer-' + this.id;

        if (this.map.getSource(sourceId)) {
            this.map.getSource(sourceId).setData({ type: "FeatureCollection", features: highlightArea });
        } else {
            this.map.addSource(sourceId, {
                type: 'geojson',
                data: { type: "FeatureCollection", features: highlightArea }
            });
        }

        if (!this.map.getLayer(layerId)) {
            this.map.addLayer({
                id: layerId,
                type: 'fill',
                source: sourceId,
                paint: {
                    'fill-color': this.selectedAreaSetting?.color || 'orange',
                    'fill-opacity': this.selectedAreaSetting?.opacity || 0.4
                }
            });
            this.map.moveLayer('outline');
            this.map.moveLayer(this.id);
        }
    }

    showSelectedPoint(selectedArea) {
        if (!this.map || this.size <= 0 || !this.selectedPointSetting) return;

        for (let polygon of selectedArea) {
            const point = turf.centroid(polygon).geometry.coordinates;
            if (!this.selecttedPoint.some(el => el[0] === point[0] && el[1] === point[1])) {
                this.selecttedPoint.push(point);
                const markerParent = document.createElement('div');
                const markerEl = document.createElement('div');
                markerEl.innerHTML = `<p class="uppercase">${polygon.properties.alt_name}</p>`;
                markerEl.classList.add('marker-daerah', 'show-pop-up');
                markerParent.appendChild(markerEl);
                new mapboxgl.Marker(markerParent)
                    .setLngLat(point)
                    .addTo(this.map);
            }
        }
    }

    checkPoint() {
        if (!this.map || this.size <= 0) return [];
        const coordinate = [this.center[0], this.center[1]];
        const radius = this.size;
        const buffer = turf.buffer(turf.point(coordinate), radius, { units: 'meters' });

        let highlightArea = [];

        for (let polygon of this.allPolygon) {
            let point = polylabel(polygon.geometry.coordinates, 1.0);
            if (!point || isNaN(point[0]) || isNaN(point[1])) {
                point = turf.centroid(polygon).geometry.coordinates;
            }
            if (turf.booleanContains(buffer, turf.point(point))) {
                highlightArea.push(polygon);
            }
        }

        return highlightArea;
    }
}
