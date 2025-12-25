# Table Grid Demo

React table component with PrimeReact DataTable featuring flexible scrolling, dialog display, image lightbox, drag-and-drop, power toggle controls, and **image upload functionality**.

## Features

### Main Table
- 📊 Interactive DataTable with Route, Shift, Warehouse columns
- ✏️ Editable cells (Edit Mode)
- ➕ Add New Row button (Edit Mode)
- 🗑️ Delete Row per row (Edit Mode)
- 👁️ Show/Edit buttons to open dialog

### Dialog Table (Flex Scroll)
- **No** - Sequential row number
- **Code** - Editable code field with duplicate validation
- **Location** - Editable location name
- **Delivery** - Delivery frequency
- **Action Column**:
  - 🖼️ **Image Thumbnails** - Click to open lightbox gallery with zoom & thumbnails
  - 📤 **Image Upload** - Upload images directly to external hosting (Edit Mode only)
  - ℹ️ **Info Button** - View detailed row information
  - ⚡ **Power Toggle** - ON/OFF switch (Edit Mode only)
  - 🔀 **Draggable Rows** - Reorder by dragging (Edit Mode only)

### Image Upload Features
- 📤 **Upload Images** - Upload images via drag-and-drop or file selector
- 🖼️ **Image Management** - Add, edit, or delete image URLs
- ☁️ **External Hosting** - Images stored on ImgBB (free, permanent, CDN)
- ✅ **Validation** - File type and size validation (10MB max)
- 🔒 **Secure** - API key hidden on server (Vercel serverless function)
- 🚀 **Vercel Compatible** - Optimized for serverless deployment

### Validation Features
- 🚫 **Duplicate Prevention** - Automatic detection and prevention of duplicate values
  - Real-time validation while editing
  - Visual indicators (red border, warning icon)
  - Toast notification on save attempt
  - Shake animation for invalid input
- ✅ **Unique Code Validation** - Ensures all codes in the table are unique
- 🔒 **Route Name Validation** - Prevents duplicate route names

### Theme & Mode Controls
- 🌙 **Dark/Light Mode** - Toggle theme colors
- ✏️ **Edit Mode** - Enable/disable all editing features
  - When ON: Edit cells, toggle power, drag rows, add/delete, upload images
  - When OFF: View-only mode

## Technologies
- React 18.2.0
- PrimeReact 10.5.1 (DataTable, Dialog, InputSwitch, Image with built-in preview)
- Vite 5.1.0
- Prisma (Database ORM)
- ImgBB API (Image hosting)
- Formidable (File upload handling)
- Vercel (Serverless deployment)

## Installation

Install dependencies:

```bash
npm install
```

## Environment Setup

### Required Environment Variables

Create a `.env` file in the project root:

```env
# Database (Required)
DATABASE_URL="postgresql://user:password@localhost:5432/tablegrod"

# Image Upload (Required for production)
IMGBB_API_KEY="your_imgbb_api_key_here"
```

**Get ImgBB API Key (FREE):**
1. Go to https://api.imgbb.com/
2. Sign up for free account
3. Copy your API key

**For Vercel deployment:**
- Add `IMGBB_API_KEY` to Vercel Environment Variables
- See [QUICKSTART.md](QUICKSTART.md) for quick setup
- See [IMAGE_UPLOAD_GUIDE.md](IMAGE_UPLOAD_GUIDE.md) for detailed guide

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

## Deployment

### Vercel Deployment (Recommended)

**Quick Deploy:**
```bash
# 1. Install Vercel CLI (if not installed)
npm i -g vercel

# 2. Deploy
vercel --prod
```

**Setup Image Upload:**
1. Add environment variable in Vercel Dashboard:
   - `IMGBB_API_KEY` = your ImgBB API key
2. See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) for complete guide

**Documentation:**
- 📖 [QUICKSTART.md](QUICKSTART.md) - 3-step quick setup
- 📖 [IMAGE_UPLOAD_GUIDE.md](IMAGE_UPLOAD_GUIDE.md) - Complete image upload guide
- 📖 [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Deployment steps
- 📖 [IMAGE_UPLOAD_FIX_SUMMARY.md](IMAGE_UPLOAD_FIX_SUMMARY.md) - Technical overview
- 📖 [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) - Vercel deployment guide

## Project Structure

```
src/
├── FlexibleScrollDemo.jsx   # Main component with table
├── components/
│   ├── ImageLightbox.jsx    # Image lightbox component
│   └── MiniMap.jsx          # Map component
├── service/
│   └── CustomerService.js   # Customer data service
├── hooks/
│   ├── useDeviceDetect.js   # Device detection hook
│   └── usePWAInstall.js     # PWA installation hook
├── main.jsx                 # Entry point
└── index-clean.css         # Global styles

api/
├── locations.js            # Locations API endpoint
├── routes.js              # Routes API endpoint
└── upload.js              # Image upload API endpoint (NEW!)

prisma/
├── schema.prisma          # Database schema
└── seed.js               # Database seeding
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