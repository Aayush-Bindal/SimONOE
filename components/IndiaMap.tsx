"use client";
import { MapContainer, TileLayer, GeoJSON, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from './ui/card';

// Simplified GeoJSON-like structure would go here. 
// For this demo, we will use a basic container as full GeoJSON is too large for context.
// In a real app, import your india-states.json here.

const mapStyle = {
    fillColor: '#7A1F1F',
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7
};

export default function IndiaMap() {
    return (
        <Card className="h-[400px] w-full overflow-hidden relative bg-blue-50/50 border-gov-navy/20">
             <div className="absolute inset-0 flex items-center justify-center text-gov-navy/40 font-bold z-0 pointer-events-none">
                Interactive Map Component Loaded
             </div>
             
             <MapContainer 
                center={[20.5937, 78.9629]} 
                zoom={4} 
                scrollWheelZoom={false} 
                style={{ height: "100%", width: "100%", zIndex: 1 }}
                attributionControl={false}
             >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />
                {/* <GeoJSON data={indiaGeoData} style={mapStyle} onEachFeature={...} /> 
                  GeoJSON omitted for brevity 
                */}
            </MapContainer>
            
            <div className="absolute bottom-4 right-4 bg-white/90 p-2 rounded shadow text-xs z-[400]">
                <div className="font-bold mb-1">Impact Intensity</div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gov-maroon"></div> High
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gov-gold"></div> Medium
                </div>
            </div>
        </Card>
    );
}