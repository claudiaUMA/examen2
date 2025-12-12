'use client';
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Arreglo de iconos rotos por defecto en Leaflet + Next.js
const iconUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

// Componente auxiliar para recentrar el mapa
function RecenterMap({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) map.setView(center, 15);
    }, [center, map]);
    return null;
}

export default function Map({ reviews, center }) {
    // Coordenadas por defecto (Málaga)
    const defaultCenter = [36.7213, -4.4214]; 

    return (
        <MapContainer center={center || defaultCenter} zoom={13} style={{ height: "400px", width: "100%", borderRadius: "10px" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <RecenterMap center={center} />
            
            {reviews.map((r) => (
                r.coordinates && (
                    <Marker key={r.id} position={[r.coordinates.lat, r.coordinates.lon]}>
                        <Popup>
                            <strong>{r.place_name}</strong><br/>
                            ⭐ {r.rating}/5
                        </Popup>
                    </Marker>
                )
            ))}
        </MapContainer>
    );
}