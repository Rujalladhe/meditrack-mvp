'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const userIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const pharmacyIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const selectedPharmacyIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface PharmacyMapProps {
    userLocation: { lat: number; lng: number };
    pharmacies: {
        id: string;
        name: string;
        position: { lat: number; lng: number };
        address: string;
        contactNumber: string;
    }[];
    selectedPharmacyId?: string;
}

function MapBounds({ userLocation, pharmacies }: {
    userLocation: { lat: number; lng: number };
    pharmacies: { position: { lat: number; lng: number } }[];
}) {
    const map = useMap();

    useEffect(() => {
        if (!userLocation) return;

        // Force the map to center and zoom on the user's location
        // We use a high street-level zoom by default
        const zoomLevel = 14;

        map.flyTo([userLocation.lat, userLocation.lng], zoomLevel, {
            duration: 1.5,
            easeLinearity: 0.25
        });
    }, [map, userLocation]);

    return null;
}

export default function PharmacyMap({ userLocation, pharmacies, selectedPharmacyId }: PharmacyMapProps) {
    return (
        <MapContainer
            center={[userLocation.lat, userLocation.lng]}
            zoom={13}
            style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
            scrollWheelZoom={true}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            <MapBounds userLocation={userLocation} pharmacies={pharmacies} />

            {/* User Location Marker */}
            <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                <Popup>
                    <div className="text-center">
                        <strong>Your Location</strong>
                    </div>
                </Popup>
            </Marker>

            {/* Pharmacy Markers */}
            {pharmacies.map((pharmacy) => (
                <Marker
                    key={pharmacy.id}
                    position={[pharmacy.position.lat, pharmacy.position.lng]}
                    icon={pharmacy.id === selectedPharmacyId ? selectedPharmacyIcon : pharmacyIcon}
                >
                    <Popup>
                        <div className="min-w-[200px]">
                            <h3 className="font-bold text-lg mb-2">{pharmacy.name}</h3>
                            <p className="text-sm text-gray-600 mb-1">📍 {pharmacy.address}</p>
                            <p className="text-sm text-gray-600 mb-2">📞 {pharmacy.contactNumber}</p>
                            <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${pharmacy.position.lat},${pharmacy.position.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full text-center px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                            >
                                Get Directions
                            </a>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
