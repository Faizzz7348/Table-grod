# Info Modal Map Feature - Setup Instructions

## Changes Made

### 1. Database Schema Updates
- Added `latitude` (Float), `longitude` (Float), and `address` (String) fields to the Location model in `prisma/schema.prisma`

### 2. New Components
- Created `src/components/MiniMap.jsx` - A mini map component with:
  - OpenStreetMap integration using React-Leaflet
  - Marker display for location coordinates
  - Fullscreen capability
  - Address caption below the map
  - Default location (Kuala Lumpur) when no coordinates are set

### 3. API Updates
- Updated `api/locations.js` to handle the new latitude, longitude, and address fields in both POST and PUT operations

### 4. UI Updates
- Modified Info Modal in `src/FlexibleScrollDemo.jsx`:
  - **Header**: Now displays "Code - Location" (e.g., "106 - Wisma Cimb") centered at 12px
  - **Content**: Shows mini map with marker and address caption below
  - **Edit Mode**: Allows editing of latitude, longitude, and address/caption
  - **Fullscreen**: Button to view map in fullscreen mode
  - **Improved Layout**: Better organized information display

## Setup Steps

### 1. Install Dependencies
```bash
npm install leaflet react-leaflet@4 --legacy-peer-deps
```

### 2. Update Database Schema
```bash
npm run db:push
```
This will update your database with the new fields (latitude, longitude, address).

### 3. (Optional) Update Existing Records
If you have existing location records and want to add coordinates, you can:
1. Click on any location's info icon (ℹ️)
2. Click "Edit Location Info"
3. Fill in the latitude, longitude, and address
4. Click "Save"
5. Click the main "Save Changes" button to persist to database

## Features

### Info Modal Features:
- **Header**: Displays Code and Location name (center-aligned, 12px font)
- **Mini Map**: 
  - Shows OpenStreetMap with marker at specified coordinates
  - Default view shows Kuala Lumpur if no coordinates set
  - Fullscreen button (top-right of map)
  - Address caption displayed below the map
- **Edit Mode**:
  - Input fields for Latitude, Longitude, and Address/Caption
  - Save/Cancel buttons
  - Changes are saved to local state and require main "Save Changes" to persist
- **General Information Section**:
  - Displays No, Code, Delivery, Power Mode, Current Status, and Total Images

### Map Features:
- **Marker**: Red marker pin at the specified location
- **Popup**: Click marker to see address and coordinates
- **Fullscreen**: Click maximize button to open full-screen map view
- **Address Caption**: Shows below mini map with location icon

## Example Coordinates

Here are some example coordinates in Malaysia you can use for testing:

- **Wisma CIMB, KL**: 3.1516, 101.6942
- **KLCC**: 3.1578, 101.7116
- **Pavilion KL**: 3.1498, 101.7138
- **Mid Valley Megamall**: 3.1175, 101.6775
- **Sunway Pyramid**: 3.0732, 101.6076
- **1 Utama**: 3.1502, 101.6150

## Notes

- The map uses OpenStreetMap tiles (free, no API key required)
- Coordinates should be in decimal format (e.g., 3.139, not 3°8'20"N)
- The address field is optional and used as a caption/label
- Maps are interactive in fullscreen mode (zoom, pan)
- Mini maps have interaction disabled to prevent accidental scrolling

## Troubleshooting

If you see "Tile loading errors" in the map:
- Check your internet connection
- Make sure the OpenStreetMap tile server is accessible
- The tiles may take a moment to load on first view

If coordinates don't display correctly:
- Ensure latitude is between -90 and 90
- Ensure longitude is between -180 and 180
- Verify the format is decimal (not degrees/minutes/seconds)
