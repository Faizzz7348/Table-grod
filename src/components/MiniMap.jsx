import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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

export default function MiniMap({ latitude, longitude, address, locations = [], style = {} }) {
    const [fullscreenVisible, setFullscreenVisible] = useState(false);
    
    // Default coordinates (Kuala Lumpur) if no coordinates provided
    const defaultLat = 3.139;
    const defaultLng = 101.6869;
    
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
            <div style={{ position: 'relative', ...style }}>
                <MapContainer
                    center={center}
                    zoom={zoom}
                    style={{ 
                        height: '200px', 
                        width: '100%', 
                        borderRadius: '8px',
                        border: '2px solid #e0e0e0'
                    }}
                    scrollWheelZoom={false}
                    dragging={false}
                    doubleClickZoom={false}
                    zoomControl={false}
                    touchZoom={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {isMultipleMarkers ? (
                        // Multiple markers
                        locations
                            .filter(loc => loc.latitude !== null && loc.latitude !== undefined &&
                                         loc.longitude !== null && loc.longitude !== undefined)
                            .map((loc, index) => (
                                <Marker key={index} position={[loc.latitude, loc.longitude]}>
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
                            <Marker position={center}>
                                <Popup>
                                    {address || 'Location'}
                                </Popup>
                            </Marker>
                        )
                    )}
                </MapContainer>
                
                {/* Fullscreen Button */}
                <Button
                    icon="pi pi-window-maximize"
                    className="p-button-rounded p-button-info"
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        zIndex: 1000
                    }}
                    onClick={() => setFullscreenVisible(true)}
                    tooltip="Fullscreen Map"
                    tooltipOptions={{ position: 'left' }}
                />
                
                {/* Address Caption */}
                {!isMultipleMarkers && address && (
                    <div style={{
                        marginTop: '10px',
                        padding: '8px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '4px',
                        fontSize: '13px',
                        color: '#555',
                        textAlign: 'center',
                        fontStyle: 'italic'
                    }}>
                        <i className="pi pi-map-marker" style={{ marginRight: '5px', color: '#dc3545' }}></i>
                        {address}
                    </div>
                )}
                
                {isMultipleMarkers && (
                    <div style={{
                        marginTop: '10px',
                        padding: '8px',
                        backgroundColor: '#e3f2fd',
                        borderRadius: '4px',
                        fontSize: '13px',
                        color: '#1565c0',
                        textAlign: 'center',
                        fontWeight: 'bold'
                    }}>
                        <i className="pi pi-map-marker" style={{ marginRight: '5px' }}></i>
                        {locations.filter(loc => loc.latitude && loc.longitude).length} locations shown on map
                    </div>
                )}
                
                {!hasValidCoordinates && (
                    <div style={{
                        marginTop: '10px',
                        padding: '8px',
                        backgroundColor: '#fff3cd',
                        borderRadius: '4px',
                        fontSize: '12px',
                        color: '#856404',
                        textAlign: 'center'
                    }}>
                        <i className="pi pi-info-circle" style={{ marginRight: '5px' }}></i>
                        {isMultipleMarkers ? 'No locations with coordinates found.' : 'No coordinates set. Showing default location (KL).'}
                    </div>
                )}
            </div>
            
            {/* Fullscreen Dialog */}
            <Dialog
                header={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="pi pi-map" style={{ fontSize: '1.2rem' }}></i>
                        <span>{isMultipleMarkers ? 'Route Map View' : 'Map View'}</span>
                    </div>
                }
                visible={fullscreenVisible}
                style={{ width: '90vw', height: '90vh' }}
                maximizable
                modal
                onHide={() => setFullscreenVisible(false)}
                contentStyle={{ height: 'calc(100% - 60px)', padding: 0 }}
            >
                <MapContainer
                    center={center}
                    zoom={zoom}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapUpdater center={center} zoom={zoom} />
                    {isMultipleMarkers ? (
                        // Multiple markers
                        locations
                            .filter(loc => loc.latitude !== null && loc.latitude !== undefined &&
                                         loc.longitude !== null && loc.longitude !== undefined)
                            .map((loc, index) => (
                                <Marker key={index} position={[loc.latitude, loc.longitude]}>
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
                            <Marker position={center}>
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
                    <div style={{
                        position: 'absolute',
                        bottom: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'white',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                        zIndex: 1000,
                        maxWidth: '80%',
                        textAlign: 'center'
                    }}>
                        <i className="pi pi-map-marker" style={{ marginRight: '8px', color: '#dc3545' }}></i>
                        <strong>{address}</strong>
                    </div>
                )}
                
                {isMultipleMarkers && (
                    <div style={{
                        position: 'absolute',
                        bottom: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'white',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                        zIndex: 1000,
                        maxWidth: '80%',
                        textAlign: 'center'
                    }}>
                        <i className="pi pi-map-marker" style={{ marginRight: '8px', color: '#1565c0' }}></i>
                        <strong>{locations.filter(loc => loc.latitude && loc.longitude).length} Locations</strong>
                    </div>
                )}
            </Dialog>
        </>
    );
}
