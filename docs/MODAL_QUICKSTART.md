# 🚀 Quick Start - Animated Modal

## Cara Test Modal Dengan Cepat

### Pilihan 1: Test Modal Demo (Recommended)

Edit file `src/main.jsx` dan uncomment baris AnimatedModalDemo:

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import FlexibleScrollDemo from './FlexibleScrollDemo.jsx'
import { AnimatedModalDemo } from './components/AnimatedModalDemo'  // ← Import ni
import './index-clean.css'
import 'primeicons/primeicons.css';
import 'leaflet/dist/leaflet.css';

const rootElement = document.getElementById('root');
createRoot(rootElement).render(
  <StrictMode>
    <AnimatedModalDemo />   {/* ← Uncomment baris ni */}
    {/* <FlexibleScrollDemo /> */}  {/* ← Comment baris ni */}
  </StrictMode>,
)
```

Kemudian run:
```bash
npm run dev
```

### Pilihan 2: Test Semua Contoh Modal

Edit `src/main.jsx`:

```jsx
import { ModalExamples } from './components/ModalExamples'

createRoot(rootElement).render(
  <StrictMode>
    <ModalExamples />
  </StrictMode>,
)
```

### Pilihan 3: Tambah Modal ke App Yang Ada

Dalam mana-mana component (contoh: FlexibleScrollDemo.jsx), import dan gunakan:

```jsx
import {
  Modal,
  ModalTrigger,
  ModalBody,
  ModalContent,
  ModalFooter,
} from './components/AnimatedModal';

// Dalam component return:
<Modal>
  <ModalTrigger>
    Buka Modal
  </ModalTrigger>
  
  <ModalBody>
    <ModalContent>
      <h2>Tajuk Modal Anda</h2>
      <p>Kandungan di sini...</p>
    </ModalContent>
    <ModalFooter>
      <button>OK</button>
    </ModalFooter>
  </ModalBody>
</Modal>
```

## Files Yang Dibuat

✅ `src/components/AnimatedModal.jsx` - Main modal component
✅ `src/components/AnimatedModalDemo.jsx` - Demo dengan contoh lengkap
✅ `src/components/ModalExamples.jsx` - 5 contoh penggunaan berbeza
✅ `ANIMATED_MODAL_README.md` - Dokumentasi lengkap
✅ `MODAL_QUICKSTART.md` - Panduan ni

## Custom Styling

Modal menggunakan Tailwind-style classes. Untuk customize:

### Button Style
```jsx
<ModalTrigger className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3">
  Custom Button
</ModalTrigger>
```

### Modal Content
```jsx
<ModalContent className="bg-gradient-to-br from-blue-50 to-purple-50">
  {/* Content */}
</ModalContent>
```

### Footer Buttons
```jsx
<ModalFooter className="gap-4 justify-center">
  <button className="px-6 py-2 bg-red-500 text-white rounded-lg">
    Delete
  </button>
</ModalFooter>
```

## Dark Mode

Modal automatically support dark mode! Classes yang digunakan:

- `dark:bg-neutral-900` - Background
- `dark:text-white` - Text
- `dark:border-neutral-800` - Border

Untuk toggle dark mode dalam app, tambah class `dark` pada `<body>`:

```javascript
document.body.classList.toggle('dark');
```

## Animation Customization

Edit nilai dalam `AnimatedModal.jsx`:

```jsx
<motion.div
  initial={{ opacity: 0, scale: 0.5 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{
    type: "spring",
    stiffness: 260,  // ← Laraskan untuk animation lebih snappy/soft
    damping: 20,     // ← Laraskan untuk bouncing
  }}
>
```

## Troubleshooting

### Modal tak nampak?
- Check sama ada framer-motion installed: `npm list framer-motion`
- Pastikan import path betul
- Check console untuk errors

### Animation patah-patah?
- Clear browser cache
- Check performance browser
- Reduce backdrop blur: `backdropFilter: "blur(5px)"`

### Dark mode tak jalan?
- Pastikan body ada class `dark`
- Check CSS ada support untuk dark: prefix

## Next Steps

1. ✅ Test modal dengan `npm run dev`
2. 📖 Baca dokumentasi lengkap di `ANIMATED_MODAL_README.md`
3. 🎨 Customize modal ikut design app anda
4. 🚀 Integrate dalam app yang ada

## Support

Kalau ada masalah:
1. Check dokumentasi lengkap
2. Lihat contoh dalam `ModalExamples.jsx`
3. Test dengan `AnimatedModalDemo.jsx` dulu

Happy coding! 🎉
