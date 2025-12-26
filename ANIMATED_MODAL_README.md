# Animated Modal Component 🎨

Komponen modal yang cantik dengan animasi smooth menggunakan Framer Motion, terinspirasi dari Aceternity UI.

## Ciri-ciri Utama ✨

- ✅ Animasi smooth dengan Framer Motion
- ✅ Backdrop blur effect
- ✅ Support dark mode
- ✅ Responsive design
- ✅ 3D transform effects
- ✅ Easy to use API
- ✅ Customizable content

## Installation

Package yang diperlukan sudah diinstall:
```bash
npm install framer-motion
```

## Cara Penggunaan 📖

### 1. Import komponen yang diperlukan

```jsx
import {
  Modal,
  ModalTrigger,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "./components/AnimatedModal";
```

### 2. Struktur Asas

```jsx
function MyComponent() {
  return (
    <Modal>
      {/* Button untuk buka modal */}
      <ModalTrigger>
        Klik Sini
      </ModalTrigger>
      
      {/* Kandungan modal */}
      <ModalBody>
        <ModalContent>
          <h2>Tajuk Modal</h2>
          <p>Kandungan modal anda di sini...</p>
        </ModalContent>
        
        <ModalFooter>
          <button>Batal</button>
          <button>Simpan</button>
        </ModalFooter>
      </ModalBody>
    </Modal>
  );
}
```

### 3. Contoh Lengkap dengan Custom Styling

```jsx
import React from "react";
import {
  Modal,
  ModalTrigger,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "./components/AnimatedModal";

export function CustomModal() {
  return (
    <Modal>
      <ModalTrigger className="bg-blue-500 hover:bg-blue-600">
        <span>Buka Modal Cantik</span>
      </ModalTrigger>
      
      <ModalBody>
        <ModalContent>
          <h2 className="text-2xl font-bold mb-4">
            Selamat Datang!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Ini adalah modal yang cantik dengan animasi smooth.
          </p>
          
          <div className="mt-6">
            <img 
              src="https://via.placeholder.com/400" 
              alt="Demo"
              className="rounded-lg w-full"
            />
          </div>
        </ModalContent>
        
        <ModalFooter className="gap-4">
          <button className="px-4 py-2 bg-gray-200 rounded-md">
            Batal
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
            Teruskan
          </button>
        </ModalFooter>
      </ModalBody>
    </Modal>
  );
}
```

## API Reference

### Modal
Container utama untuk modal. Mesti wrap semua komponen modal yang lain.

```jsx
<Modal>
  {children}
</Modal>
```

### ModalTrigger
Button yang akan membuka modal.

**Props:**
- `children`: Content untuk button
- `className`: Custom CSS classes (optional)

```jsx
<ModalTrigger className="custom-button-class">
  Buka Modal
</ModalTrigger>
```

### ModalBody
Container untuk kandungan modal. Handle animasi open/close.

**Props:**
- `children`: Modal content
- `className`: Custom CSS classes (optional)

```jsx
<ModalBody className="custom-modal-class">
  {children}
</ModalBody>
```

### ModalContent
Section untuk kandungan utama modal dengan scrolling.

**Props:**
- `children`: Main content
- `className`: Custom CSS classes (optional)

```jsx
<ModalContent className="p-6">
  <h2>Tajuk</h2>
  <p>Kandungan...</p>
</ModalContent>
```

### ModalFooter
Footer section untuk action buttons.

**Props:**
- `children`: Footer content (usually buttons)
- `className`: Custom CSS classes (optional)

```jsx
<ModalFooter className="justify-between">
  <button>Kiri</button>
  <button>Kanan</button>
</ModalFooter>
```

## Testing Modal

Untuk test modal, boleh run:

```bash
# Tukar main entry point dalam vite.config.js atau
# Edit index.html untuk import main-modal-demo.jsx

npm run dev
```

Atau import terus dalam komponen yang ada:

```jsx
import { AnimatedModalDemo } from './components/AnimatedModalDemo';

function App() {
  return (
    <div>
      <AnimatedModalDemo />
    </div>
  );
}
```

## Dark Mode Support 🌙

Modal automatically support dark mode. Classes yang digunakan:
- `dark:bg-neutral-900` - Background dalam dark mode
- `dark:text-white` - Text color dalam dark mode
- `dark:border-neutral-800` - Border dalam dark mode

## Customization Tips 🎨

### Custom Animation
Edit animation settings dalam ModalBody component:

```jsx
<motion.div
  initial={{ opacity: 0, scale: 0.5 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.8 }}
  transition={{
    type: "spring",
    stiffness: 300,  // Laraskan ini
    damping: 25,     // Dan ini
  }}
>
```

### Custom Button Animation
ModalTrigger sudah ada hover effects, tapi boleh customize:

```jsx
<ModalTrigger className="group">
  <span className="group-hover:scale-110 transition">
    Button Text
  </span>
</ModalTrigger>
```

### Backdrop Blur Intensity
Edit dalam Overlay component untuk adjust blur:

```jsx
animate={{
  opacity: 1,
  backdropFilter: "blur(20px)", // Increase untuk blur lebih
}}
```

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## Performance Tips 🚀

1. Modal hanya render bila dibuka (using AnimatePresence)
2. Body scroll disabled bila modal open
3. Cleanup automatic bila modal close

## Troubleshooting

### Modal tidak muncul?
- Pastikan import semua komponen yang betul
- Check z-index dalam CSS
- Verify framer-motion installed

### Animation tidak smooth?
- Pastikan tidak ada conflicting CSS
- Check browser support untuk backdrop-filter
- Try adjust transition values

## Credits

Design inspired by [Aceternity UI](https://ui.aceternity.com/components/animated-modal)

---

Sebarang masalah atau soalan, sila rujuk dokumentasi atau create issue. Happy coding! 🎉
