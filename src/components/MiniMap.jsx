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

export default function MiniMap({ latitude, longitude, address, style = {} }) {
    const [fullscreenVisible, setFullscreenVisible] = useState(false);
    
    // Default coordinates (Kuala Lumpur) if no coordinates provided
    const defaultLat = 3.139;
    const defaultLng = 101.6869;
    
    const lat = latitude !== null && latitude !== undefined ? latitude : defaultLat;
    const lng = longitude !== null && longitude !== undefined ? longitude : defaultLng;
    const position = [lat, lng];
    
    const hasValidCoordinates = latitude !== null && latitude !== undefined && 
                                longitude !== null && longitude !== undefined;

    return (
        <>
            {/* Mini Map Container */}
            <div style={{ position: 'relative', ...style }}>
                <MapContainer
                    center={position}
                    zoom={hasValidCoordinates ? 15 : 11}
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
                    {hasValidCoordinates && (
                        <Marker position={position}>
                            <Popup>
                                {address || 'Location'}
                            </Popup>
                        </Marker>
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
                {address && (
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
                        No coordinates set. Showing default location (KL).
                    </div>
                )}
            </div>
            
            {/* Fullscreen Dialog */}
            <Dialog
                header={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="pi pi-map" style={{ fontSize: '1.2rem' }}></i>
                        <span>Map View</span>
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
                    center={position}
                    zoom={hasValidCoordinates ? 15 : 11}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapUpdater center={position} zoom={hasValidCoordinates ? 15 : 11} />
                    {hasValidCoordinates && (
                        <Marker position={position}>
                            <Popup>
                                <strong>{address || 'Location'}</strong>
                                <br />
                                Lat: {lat.toFixed(6)}
                                <br />
                                Lng: {lng.toFixed(6)}
                            </Popup>
                        </Marker>
                    )}
                </MapContainer>
                
                {address && (
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
            </Dialog>
        </>
    );
}
