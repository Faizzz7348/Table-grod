# Image Lightbox Component

Component ImageLightbox yang modern menggunakan library LightGallery dengan features lengkap seperti thumbnails, zoom, dan fullscreen.

## Features

- ✨ **Modern Design**: Efek blur dan glassmorphism
- 🖼️ **Thumbnails**: Preview gambar dengan thumbnail yang interaktif
- 🔍 **Zoom**: Fitur zoom in/out untuk melihat detail
- 🖥️ **Fullscreen**: Mode fullscreen untuk pengalaman viewing yang lebih baik
- 📱 **Responsive**: Optimal untuk mobile dan desktop
- ⚡ **Lazy Loading**: Loading gambar secara optimal
- 🎨 **Captions**: Mendukung caption dan deskripsi untuk setiap gambar

## Installation

Package sudah terinstall di `package.json`:

```json
{
  "dependencies": {
    "lightgallery": "^2.9.0",
    "lg-thumbnail": "^1.2.1",
    "lg-zoom": "^1.3.0"
  }
}
```

## Usage

### Basic Example

```jsx
import ImageLightbox from './components/ImageLightbox';

function MyComponent() {
  // Array of image URLs
  const images = [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg'
  ];

  return (
    <ImageLightbox 
      images={images} 
      rowId="unique-id"
    />
  );
}
```

### With Captions

```jsx
import ImageLightbox from './components/ImageLightbox';

function MyComponent() {
  // Array of image objects with captions
  const images = [
    {
      url: 'https://example.com/image1.jpg',
      caption: 'Beautiful Sunset',
      description: 'A stunning view of the sunset over the ocean'
    },
    {
      url: 'https://example.com/image2.jpg',
      caption: 'Mountain Peak',
      description: 'Snow-capped mountains at dawn'
    }
  ];

  return (
    <ImageLightbox 
      images={images} 
      rowId="unique-id"
    />
  );
}
```

### In DataTable Column

```jsx
<Column 
  header="Image" 
  body={(rowData) => {
    if (!rowData.images || rowData.images.length === 0) {
      return <div>No Images</div>;
    }
    
    return (
      <ImageLightbox 
        images={rowData.images} 
        rowId={rowData.id}
      />
    );
  }}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `images` | `Array<string \| Object>` | Yes | Array of image URLs (strings) atau objects dengan properties `url`, `caption`, `description` |
| `rowId` | `string \| number` | Yes | Unique identifier untuk gallery (untuk multiple galleries di satu halaman) |

## Image Object Structure

Jika menggunakan object, struktur yang disupport:

```typescript
{
  url: string;           // URL gambar (required)
  caption?: string;      // Judul gambar (optional)
  description?: string;  // Deskripsi gambar (optional)
}
```

## Styling

CSS styling untuk lightgallery sudah ditambahkan di `src/index.css` dengan features:

- **Backdrop Blur**: Efek blur pada background
- **Glass Effect**: Toolbar dan thumbnails dengan glassmorphism
- **Custom Colors**: Menggunakan color scheme blue (#3b82f6)
- **Smooth Transitions**: Animasi yang smooth
- **Mobile Responsive**: Optimized untuk layar kecil

## Customization

### Mengubah Warna Accent

Edit di `src/index.css`:

```css
.lg-outer .lg-thumb-item.active {
  border-color: #your-color;  /* Ubah warna border thumbnail aktif */
  box-shadow: 0 0 15px rgba(your-color, 0.5);
}

.lg-progress-bar .lg-progress {
  background-color: #your-color;  /* Ubah warna progress bar */
}
```

### Mengubah Ukuran Thumbnail

Edit di `src/components/ImageLightbox.jsx`:

```jsx
gallery = lightGallery(containerRef.current, {
  // ... other options
  thumbWidth: 120,      // Ubah lebar thumbnail
  thumbHeight: "90px",  // Ubah tinggi thumbnail
  thumbMargin: 8,       // Ubah margin antar thumbnail
});
```

## Browser Support

- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Tips

1. **Ukuran Gambar**: Gunakan gambar dengan resolusi yang sesuai (tidak terlalu besar untuk performa)
2. **Format**: Mendukung JPG, PNG, GIF, WebP
3. **Loading**: Component menggunakan lazy loading untuk performa optimal
4. **Multiple Galleries**: Pastikan setiap gallery memiliki `rowId` yang unik

## Troubleshooting

### Gambar tidak muncul
- Pastikan URL gambar valid dan accessible
- Check browser console untuk error CORS

### Lightgallery tidak terbuka
- Pastikan CSS lightgallery sudah diload
- Check console untuk error import

### Styling tidak sesuai
- Clear browser cache
- Pastikan `src/index.css` sudah diupdate dengan styling lightgallery

## Example in Project

Lihat implementasi lengkap di:
- `src/components/ImageLightbox.jsx` - Component utama
- `src/FlexibleScrollDemo.jsx` - Usage example dalam DataTable
- `src/index.css` - Custom styling

## License

Component ini menggunakan lightgallery dengan GPLv3 license.
