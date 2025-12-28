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
- ☁️ **Vercel Blob Storage** - Images stored permanently on Vercel's CDN (no more image loss!)
- ✅ **Validation** - File type and size validation (10MB max)
- 🔒 **Secure** - Token-based authentication with Vercel Blob
- 🚀 **Vercel Native** - Optimized for serverless deployment with permanent storage
- 💪 **No More Disappearing Images** - Fixed using Vercel Blob (see [VERCEL_BLOB_SETUP.md](docs/VERCEL_BLOB_SETUP.md))

### QR Code Features (NEW! 🎉)
- 📱 **QR Code Upload** - Upload QR code images for each location
- 🔗 **Destination URL** - Set URL that QR code points to
- 👁️ **View Mode** - Auto-scan functionality (click to go to destination)
- ✏️ **Edit Mode** - Manage QR code image and destination URL
- 🚀 **Smart Display** - Button only shows when QR code exists (view mode)

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
- Vercel Blob (Permanent image storage)
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

# Vercel Blob Storage (Required for image uploads)
BLOB_READ_WRITE_TOKEN="your_vercel_blob_token_here"
```

**Get Vercel Blob Token:**
1. Go to https://vercel.com/dashboard/stores
2. Create a Blob Store (or use existing)
3. Copy the `BLOB_READ_WRITE_TOKEN`

**For Vercel deployment:**
- Add `BLOB_READ_WRITE_TOKEN` to Vercel Environment Variables
- **CRITICAL:** This prevents images from disappearing after deployment!
- See [VERCEL_BLOB_SETUP.md](docs/VERCEL_BLOB_SETUP.md) for detailed setup guide
- See [QUICKSTART.md](docs/QUICKSTART.md) for quick setup

## Running the Project

### Development (Frontend Only)

Start the Vite development server:

```bash
npm run dev
```

The application will open at `http://localhost:5173`

**⚠️ Note:** API endpoints (image upload, QR code upload) will NOT work with this command.

### Development with API (Recommended)

Start Vercel development server with API support:

```bash
# First time only: Install Vercel CLI
npm install -g vercel

# Login and link project
vercel login
vercel link

# Pull environment variables
vercel env pull

# Start development server
npm run dev:vercel
```

The application will open at `http://localhost:3000`

**✅ With this command:** All API endpoints work including image & QR code upload!

**See detailed guide:** [VERCEL_DEV_SETUP.md](VERCEL_DEV_SETUP.md)

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
   - `BLOB_READ_WRITE_TOKEN` = your Vercel Blob token (get from https://vercel.com/dashboard/stores)
2. See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) for complete guide

**Documentation:**
- 📖 [VERCEL_DEV_SETUP.md](VERCEL_DEV_SETUP.md) - **Development dengan Vercel (MUST READ!)**
- 📖 [QR_CODE_FEATURE.md](QR_CODE_FEATURE.md) - QR Code feature guide
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