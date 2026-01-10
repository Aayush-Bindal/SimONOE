"use client";

import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from './ui/card';
import { indiaOfficialGeoJSON } from '@/lib/india-data';
import { useRef, useEffect } from 'react';
import L from 'leaflet';

interface IndiaMapProps {
  selectedStates: string[];
  onStateToggle: (stateName: string) => void;
}

// Styling Constants
const STYLE_DEFAULT = {
    fillColor: '#7A1F1F', // Maroon
    weight: 1,
    opacity: 1,
    color: '#ffffff',     // White borders
    dashArray: '0',
    fillOpacity: 0.85
};

const STYLE_SELECTED = {
    fillColor: '#D4AF37', // Gold
    weight: 2,
    color: '#000080',     // Navy Border
    fillOpacity: 1
};

const STYLE_HOVER = {
    weight: 3,
    color: '#FF9933',     // Saffron highlight
    fillOpacity: 0.9
};

export default function IndiaMap({ selectedStates, onStateToggle }: IndiaMapProps) {
    const mapRef = useRef<L.Map>(null);

    // Style function based on selection state
    const getStyle = (feature: any) => {
        const isSelected = selectedStates.includes(feature.properties.name);
        return isSelected ? STYLE_SELECTED : STYLE_DEFAULT;
    };

    const onEachFeature = (feature: any, layer: L.Layer) => {
        const stateName = feature.properties.name;

        // Tooltip
        layer.bindTooltip(stateName, {
            direction: 'center',
            className: "bg-white/90 text-gov-maroon px-2 py-0.5 text-xs font-bold border border-gov-gold shadow-sm"
        });

        // Events
        layer.on({
            mouseover: (e) => {
                const l = e.target;
                l.setStyle(STYLE_HOVER);
                l.bringToFront();
            },
            mouseout: (e) => {
                const l = e.target;
                // Revert to selected or default style
                // @ts-ignore
                const currentStyle = selectedStates.includes(stateName) ? STYLE_SELECTED : STYLE_DEFAULT;
                l.setStyle(currentStyle);
            },
            click: (e) => {
                onStateToggle(stateName);
                L.DomEvent.stopPropagation(e); // Prevent map click
            }
        });
    };

    return (
        <Card className="h-[500px] w-full overflow-hidden relative bg-blue-50/50 border-gov-navy/20 shadow-md">
             <MapContainer 
                center={[22.5, 82.5]} 
                zoom={4} 
                scrollWheelZoom={false} 
                className="h-full w-full z-10"
                attributionControl={false}
                ref={mapRef}
                dragging={true}
                doubleClickZoom={false}
             >
                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png" />
                
                {/* Key forces re-render when selection changes to update styles efficiently */}
                <GeoJSON 
                    key={JSON.stringify(selectedStates)}
                    data={indiaOfficialGeoJSON as any} 
                    style={getStyle} 
                    onEachFeature={onEachFeature} 
                />
            </MapContainer>
            
            <div className="absolute bottom-4 left-4 bg-white/95 p-3 rounded-lg border-l-4 border-l-gov-gold shadow-lg z-[400] text-xs">
                 <div className="font-bold mb-2 text-gov-maroon uppercase">Interactive Selection</div>
                 <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-gov-maroon border border-gray-400"></div> 
                    <span>Not Selected</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gov-gold border border-gov-navy"></div> 
                    <span className="font-bold">Selected for Simulation</span>
                 </div>
            </div>
        </Card>
    );
}