import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Vehicle } from '../../app/App';
import 'leaflet/dist/leaflet.css';
import './style.scss';

const Map: React.FC<{ vehicles: Vehicle[] }> = ({ vehicles }) => {
    const mapRef = useRef<L.Map | null>(null);
    const markersRef = useRef<L.Marker[]>([]);

    useEffect(() => {
        if (!mapRef.current) {
            const mapContainer = L.DomUtil.create('div', 'leaflet-map');

            document.getElementById('map-container')?.appendChild(mapContainer);

            const map = L.map(mapContainer).setView([55.751244, 37.618423], 10);
            mapRef.current = map;

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
        }

        markersRef.current.forEach(marker => marker.remove());

        const customMarker = L.divIcon({
            className: 'custom-marker',
            iconSize: [20, 20],
            iconAnchor: [20, 20],
            popupAnchor: [-10, -20]
        });

        const markers = vehicles.map(vehicle => {
            const marker = L.marker([vehicle.latitude, vehicle.longitude], { icon: customMarker })
                .bindPopup(`<b>${vehicle.name} ${vehicle.model}</b><br>Цена: ${vehicle.price}`)
                .addTo(mapRef.current!);

            marker.on('mouseover', () => {
                marker.openPopup();
            });
            marker.on('mouseout', () => {
                marker.closePopup();
            });

            marker.on('click', () => {
                mapRef.current?.setView([vehicle.latitude, vehicle.longitude], 15);
            });

            return marker;
        });
        markersRef.current = markers;

        if (markers.length > 0 && mapRef.current) {
            const group = new L.FeatureGroup<L.Marker>(markers);
            mapRef.current.fitBounds(group.getBounds());
        }
    }, [vehicles]);

    return <div id="map-container"></div>;
};

export default Map;