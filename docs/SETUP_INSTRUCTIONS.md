# Setup Instructions

## Install Dependencies

Run the following command to install the required packages:

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

## Features Added

### Dialog Table Columns:
- **No** - Sequential number (read-only)
- **Code** - Editable code field
- **Location** - Editable location name
- **Delivery** - Delivery frequency (Daily/Weekly/Monthly)
- **Action** - Contains:
  - **Images** - Thumbnail images with PrimeReact's built-in lightbox preview (click to view fullscreen)
  - **Info Button** - Shows detailed information dialog
  - **Power Toggle** - ON/OFF switch (only works in Edit Mode)

### Functionality:
- **Draggable Rows** - Enable Edit Mode to drag and reorder rows
- **Image Lightbox** - Click on images to open fullscreen preview with zoom
- **Info Dialog** - Click info button to see row details
- **Power Toggle** - Switch power ON/OFF for each row (Edit Mode only)

### Edit Mode Controls:
- Edit Mode must be ON to:
  - Edit cells (double-click)
  - Toggle power switch
  - Drag rows to reorder

## Technologies Used:
- React 18.2.0
- PrimeReact 10.5.1 (DataTable, Dialog, Image with preview, InputSwitch)
- No external lightbox library needed - uses PrimeReact's built-in Image preview!
