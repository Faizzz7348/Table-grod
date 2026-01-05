import React, { useState, useEffect, memo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl, ZoomControl } from 'react-leaflet';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const { BaseLayer } = LayersControl;

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [20, 32],
    iconAnchor: [10, 32],
    popupAnchor: [0, -32],
    shadowSize: [32, 32]
});

// Function to create premium custom colored marker icon
const createColoredMarkerIcon = (color = '#dc3545') => {
    return L.divIcon({
        className: 'custom-premium-marker-icon',
        html: `
            <div style="position: relative; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
                <svg width="28" height="36" viewBox="0 0 28 36" xmlns="http://www.w3.org/2000/svg">
                    <!-- Outer glow/shadow -->
                    <defs>
                        <linearGradient id="markerGradient-${color.replace('#', '')}" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
                            <stop offset="100%" style="stop-color:${adjustBrightness(color, -20)};stop-opacity:1" />
                        </linearGradient>
                    </defs>
                    <!-- Main marker shape with gradient -->
                    <path d="M14 0C8.5 0 4 4.5 4 10c0 7.5 10 26 10 26s10-18.5 10-26c0-5.5-4.5-10-10-10z" 
                          fill="url(#markerGradient-${color.replace('#', '')})" 
                          stroke="rgba(0,0,0,0.3)" 
                          stroke-width="0.8"/>
                    <!-- Inner white circle -->
                    <circle cx="14" cy="10" r="4.5" fill="white" opacity="0.95"/>
                    <!-- Inner colored dot -->
                    <circle cx="14" cy="10" r="2.5" fill="${color}" opacity="0.8"/>
                </svg>
            </div>
        `,
        iconSize: [28, 36],
        iconAnchor: [14, 36],
        popupAnchor: [0, -36]
    });
};

// Helper function to adjust color brightness
const adjustBrightness = (color, percent) => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1);
};

// Component to update map view when coordinates change
function MapUpdater({ center, zoom }) {
    const map = useMap();
    
    useEffect(() => {
        if (center) {
            map.setView(center, zoom);
        }
    }, [center, zoom, map]);
    
    return null;
}

const MiniMap = memo(function MiniMap({ latitude, longitude, address, locations = [], style = {}, isDark = false }) {
    const [fullscreenVisible, setFullscreenVisible] = useState(false);
    const [addressExpanded, setAddressExpanded] = useState(false);
    
    // Default marker color
    const defaultMarkerColor = '#dc3545';
    
    // Default coordinates (Kuala Lumpur) if no coordinates provided
    const defaultLat = 3.139;
    const defaultLng = 101.6869;
    
    // Malaysia bounds to restrict map area (reduce lag)
    // Southwest: [0.8, 99.6], Northeast: [7.4, 119.3]
    const malaysiaBounds = [
        [0.8, 99.6],    // Southwest corner (Johor area)
        [7.4, 119.3]     // Northeast corner (Sabah/Sarawak area)
    ];
    
    // If locations array is provided (multiple markers mode)
    const isMultipleMarkers = locations && locations.length > 0;
    
    let center, zoom, hasValidCoordinates;
    
    if (isMultipleMarkers) {
        // Filter locations with valid coordinates
        const validLocations = locations.filter(loc => 
            loc.latitude !== null && loc.latitude !== undefined &&
            loc.longitude !== null && loc.longitude !== undefined
        );
        
        if (validLocations.length > 0) {
            // Calculate center from all valid locations
            const avgLat = validLocations.reduce((sum, loc) => sum + loc.latitude, 0) / validLocations.length;
            const avgLng = validLocations.reduce((sum, loc) => sum + loc.longitude, 0) / validLocations.length;
            center = [avgLat, avgLng];
            zoom = validLocations.length === 1 ? 15 : 12;
            hasValidCoordinates = true;
        } else {
            center = [defaultLat, defaultLng];
            zoom = 11;
            hasValidCoordinates = false;
        }
    } else {
        // Single marker mode
        const lat = latitude !== null && latitude !== undefined ? latitude : defaultLat;
        const lng = longitude !== null && longitude !== undefined ? longitude : defaultLng;
        center = [lat, lng];
        zoom = latitude !== null && latitude !== undefined && 
               longitude !== null && longitude !== undefined ? 15 : 11;
        hasValidCoordinates = latitude !== null && latitude !== undefined && 
                            longitude !== null && longitude !== undefined;
    }

    return (
        <>
            {/* Mini Map Container */}
            <div style={{ position: 'relative', overflow: 'visible', ...style }}>
                <MapContainer
                    center={center}
                    zoom={zoom}
                    style={{ 
                        height: '300px', 
                        width: '100%', 
                        borderRadius: '12px',
                        border: '2px solid rgba(0,0,0,0.1)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                    className="mini-map-container"
                    scrollWheelZoom={true}
                    dragging={true}
                    doubleClickZoom={true}
                    zoomControl={false}
                    touchZoom={true}
                    maxBounds={malaysiaBounds}
                    maxBoundsViscosity={1.0}
                    minZoom={6}
                    maxZoom={18}
                >
                    <LayersControl position="topleft">
                        <BaseLayer checked name="Street Map">
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                        </BaseLayer>
                        <BaseLayer name="Satellite">
                            <TileLayer
                                attribution='&copy; <a href="https://www.esri.com">Esri</a>'
                                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                            />
                        </BaseLayer>
                    </LayersControl>
                    <ZoomControl position="bottomright" />
                    {isMultipleMarkers ? (
                        // Multiple markers
                        locations
                            .filter(loc => loc.latitude !== null && loc.latitude !== undefined &&
                                         loc.longitude !== null && loc.longitude !== undefined)
                            .map((loc, index) => (
                                <Marker 
                                    key={index} 
                                    position={[loc.latitude, loc.longitude]}
                                    icon={createColoredMarkerIcon(loc.markerColor || defaultMarkerColor)}
                                >
                                    <Popup>
                                        <strong>{loc.location || `Location ${index + 1}`}</strong>
                                        {loc.code && <><br />Code: {loc.code}</>}
                                        {loc.address && <><br />{loc.address}</>}
                                    </Popup>
                                </Marker>
                            ))
                    ) : (
                        // Single marker
                        hasValidCoordinates && (
                            <Marker 
                                position={center}
                                icon={createColoredMarkerIcon(locations[0]?.markerColor || defaultMarkerColor)}
                            >
                                <Popup>
                                    {address || 'Location'}
                                </Popup>
                            </Marker>
                        )
                    )}
                </MapContainer>
                
                {/* Fullscreen Button - Top Right of Map */}
                <div style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    zIndex: 1001
                }}>
                    <Button
                        icon="pi pi-window-maximize"
                        className="p-button-rounded p-button-info"
                        style={{
                            width: '40px',
                            height: '40px',
                            backgroundColor: '#000000',
                            borderColor: '#000000',
                            color: isDark ? '#c0c0c0' : '#ffffff',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                            border: 'none',
                            padding: '0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onClick={() => setFullscreenVisible(true)}
                        tooltip="Open Fullscreen Map"
                        tooltipOptions={{ position: 'left' }}
                    />
                </div>
                
                {/* Address Caption */}
                {!isMultipleMarkers && address && (
                    <div 
                        className="map-address-caption"
                        style={{
                            marginTop: '10px',
                            padding: '6px 8px',
                            backgroundColor: 'transparent',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontFamily: "'Open Sans', sans-serif",
                            color: 'var(--text-color)',
                            textAlign: 'center',
                            cursor: 'pointer',
                            userSelect: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            transition: 'all 0.2s ease'
                        }}
                        onClick={() => setAddressExpanded(!addressExpanded)}
                    >
                        <i 
                            className={`pi ${addressExpanded ? 'pi-chevron-up' : 'pi-chevron-down'}`} 
                            style={{ 
                                fontSize: '8px',
                                color: '#dc3545',
                                transition: 'transform 0.2s ease'
                            }}
                        ></i>
                        <span style={{
                            overflow: addressExpanded ? 'visible' : 'hidden',
                            textOverflow: addressExpanded ? 'clip' : 'ellipsis',
                            whiteSpace: addressExpanded ? 'normal' : 'nowrap',
                            maxWidth: addressExpanded ? 'none' : '100%',
                            display: addressExpanded ? 'block' : 'inline'
                        }}>
                            {address}
                        </span>
                    </div>
                )}
                

                
                {!hasValidCoordinates && (
                    <div className="map-info-box map-info-warning" style={{
                        marginTop: '10px',
                        padding: '10px',
                        backgroundColor: 'transparent',
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: isDark ? '#fbbf24' : '#856404',
                        textAlign: 'center',
                        border: 'transparent'
                    }}>
                        <i className="pi pi-info-circle" style={{ marginRight: '5px', fontSize: '14px' }}></i>
                        {isMultipleMarkers ? 'No locations with coordinates found.' : 'No coordinates set. Showing default location (KL).'}
                    </div>
                )}
            </div>
            
            {/* Fullscreen Dialog */}
            <Dialog
                header={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <i className="pi pi-map" style={{ fontSize: '1.3rem', color: '#06b6d4' }}></i>
                        <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                            {isMultipleMarkers ? 'Route Map View' : 'Map View'}
                        </span>
                    </div>
                }
                visible={fullscreenVisible}
                style={{ width: '95vw', height: '95vh' }}
                maximizable
                modal
                onHide={() => setFullscreenVisible(false)}
                contentStyle={{ height: 'calc(100% - 60px)', padding: 0, overflow: 'hidden' }}
                className="fullscreen-map-dialog"
            >
                <MapContainer
                    center={center}
                    zoom={zoom + 1}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={true}
                    zoomControl={false}
                    maxBounds={malaysiaBounds}
                    maxBoundsViscosity={1.0}
                    minZoom={6}
                    maxZoom={19}
                >
                    <LayersControl position="topright">
                        <BaseLayer checked name="Street Map">
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                        </BaseLayer>
                        <BaseLayer name="Satellite View">
                            <TileLayer
                                attribution='&copy; <a href="https://www.esri.com">Esri</a>'
                                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                            />
                        </BaseLayer>
                        <BaseLayer name="Topographic">
                            <TileLayer
                                attribution='&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors'
                                url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                            />
                        </BaseLayer>
                    </LayersControl>
                    <ZoomControl position="bottomright" />
                    <MapUpdater center={center} zoom={zoom + 1} />
                    {isMultipleMarkers ? (
                        // Multiple markers
                        locations
                            .filter(loc => loc.latitude !== null && loc.latitude !== undefined &&
                                         loc.longitude !== null && loc.longitude !== undefined)
                            .map((loc, index) => (
                                <Marker 
                                    key={index} 
                                    position={[loc.latitude, loc.longitude]}
                                    icon={createColoredMarkerIcon(loc.markerColor || defaultMarkerColor)}
                                >
                                    <Popup>
                                        <strong>{loc.location || `Location ${index + 1}`}</strong>
                                        {loc.code && <><br />Code: {loc.code}</>}
                                        {loc.address && <><br />{loc.address}</>}
                                        <br />
                                        Lat: {loc.latitude.toFixed(6)}
                                        <br />
                                        Lng: {loc.longitude.toFixed(6)}
                                    </Popup>
                                </Marker>
                            ))
                    ) : (
                        // Single marker
                        hasValidCoordinates && (
                            <Marker 
                                position={center}
                                icon={createColoredMarkerIcon(locations[0]?.markerColor || defaultMarkerColor)}
                            >
                                <Popup>
                                    <strong>{address || 'Location'}</strong>
                                    <br />
                                    Lat: {center[0].toFixed(6)}
                                    <br />
                                    Lng: {center[1].toFixed(6)}
                                </Popup>
                            </Marker>
                        )
                    )}
                </MapContainer>
                
                {!isMultipleMarkers && address && (
                    <div className="fullscreen-map-badge" style={{
                        position: 'absolute',
                        bottom: '30px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                        zIndex: 1000,
                        maxWidth: '85%',
                        textAlign: 'center',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(0,0,0,0.1)'
                    }}>
                        <i className="pi pi-map-marker" style={{ marginRight: '10px', color: '#dc3545', fontSize: '16px' }}></i>
                        <strong style={{ fontSize: '14px' }}>{address}</strong>
                    </div>
                )}
                
                {isMultipleMarkers && (
                    <div className="fullscreen-map-badge" style={{
                        position: 'absolute',
                        bottom: '30px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                        zIndex: 1000,
                        maxWidth: '85%',
                        textAlign: 'center',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(0,0,0,0.1)'
                    }}>
                        <i className="pi pi-map-marker" style={{ marginRight: '10px', color: '#06b6d4', fontSize: '16px' }}></i>
                        <strong style={{ fontSize: '14px' }}>{locations.filter(loc => loc.latitude && loc.longitude).length} Locations on Map</strong>
                    </div>
                )}
            </Dialog>
        </>
    );
});

export default MiniMap;
