# Table Grid Demo

React table component with PrimeReact DataTable featuring flexible scrolling, dialog display, image lightbox, drag-and-drop, and power toggle controls.

## Features

### Main Table
- 📊 Interactive DataTable with Route, Shift, Warehouse columns
- ✏️ Editable cells (Edit Mode)
- ➕ Add New Row button (Edit Mode)
- 🗑️ Delete Row per row (Edit Mode)
- 👁️ Show/Edit buttons to open dialog

### Dialog Table (Flex Scroll)
- **No** - Sequential row number
- **Code** - Editable code field
- **Location** - Editable location name
- **Delivery** - Delivery frequency
- **Action Column**:
  - 🖼️ **Image Thumbnails** - Click to open lightbox gallery with zoom & thumbnails
  - ℹ️ **Info Button** - View detailed row information
  - ⚡ **Power Toggle** - ON/OFF switch (Edit Mode only)
  - 🔀 **Draggable Rows** - Reorder by dragging (Edit Mode only)

### Theme & Mode Controls
- 🌙 **Dark/Light Mode** - Toggle theme colors
- ✏️ **Edit Mode** - Enable/disable all editing features
  - When ON: Edit cells, toggle power, drag rows, add/delete
  - When OFF: View-only mode

## Technologies
- React 18.2.0
- PrimeReact 10.5.1 (DataTable, Dialog, InputSwitch, Image with built-in preview)
- Vite 5.1.0
- No external lightbox library needed!

## Installation

Install dependencies:

```bash
npm install
```

## Running the Project

Start the development server:

```bash
npm run dev
```

The application will open at `http://localhost:5173`

## Build

Create a production build:

```bash
npm run build
```

## Project Structure

```
src/
├── FlexibleScrollDemo.jsx   # Main component with table
├── service/
│   └── CustomerService.js   # Customer data service
├── main.jsx                 # Entry point
└── index.css               # Global styles
```

## Component Overview

The `FlexibleScrollDemo` component displays a button that opens a dialog containing a scrollable data table with customer information including:
- Name
- Country
- Representative
- Company

## Technologies Used

- React 18
- PrimeReact 10
- Vite 5