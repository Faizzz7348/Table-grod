// ========================================
// CARA MENGGUNAKAN ANIMATED MODAL
// ========================================

// 1. IMPORT KOMPONEN MODAL
import {
  Modal,
  ModalTrigger,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "./AnimatedModal";

// ========================================
// CONTOH 1: MODAL SIMPLE
// ========================================
export function SimpleModal() {
  return (
    <Modal>
      <ModalTrigger>
        Klik Untuk Buka Modal
      </ModalTrigger>
      
      <ModalBody>
        <ModalContent>
          <h2 className="text-2xl font-bold mb-4">Tajuk Modal</h2>
          <p>Ini adalah kandungan modal yang simple.</p>
        </ModalContent>
        
        <ModalFooter>
          <button className="px-4 py-2 bg-gray-200 rounded">Tutup</button>
        </ModalFooter>
      </ModalBody>
    </Modal>
  );
}

// ========================================
// CONTOH 2: MODAL DENGAN FORM
// ========================================
export function FormModal() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted");
  };

  return (
    <Modal>
      <ModalTrigger className="bg-blue-500 text-white">
        Tambah Data Baru
      </ModalTrigger>
      
      <ModalBody>
        <ModalContent>
          <h2 className="text-2xl font-bold mb-6">Form Pendaftaran</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Nama</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Masukkan nama"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Email</label>
              <input 
                type="email" 
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="nama@email.com"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Mesej</label>
              <textarea 
                className="w-full px-3 py-2 border rounded-lg"
                rows="4"
                placeholder="Tulis mesej anda..."
              />
            </div>
          </form>
        </ModalContent>
        
        <ModalFooter className="gap-3">
          <button className="px-4 py-2 bg-gray-200 rounded-md">
            Batal
          </button>
          <button 
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Hantar
          </button>
        </ModalFooter>
      </ModalBody>
    </Modal>
  );
}

// ========================================
// CONTOH 3: MODAL DENGAN GAMBAR
// ========================================
export function ImageModal() {
  return (
    <Modal>
      <ModalTrigger className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        Lihat Gambar
      </ModalTrigger>
      
      <ModalBody>
        <ModalContent>
          <h2 className="text-2xl font-bold mb-4">Galeri Gambar</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <img 
              src="https://images.unsplash.com/photo-1517322048670-4fba75cbbb62" 
              alt="Image 1"
              className="rounded-lg w-full h-48 object-cover"
            />
            <img 
              src="https://images.unsplash.com/photo-1573790387438-4da905039392" 
              alt="Image 2"
              className="rounded-lg w-full h-48 object-cover"
            />
            <img 
              src="https://images.unsplash.com/photo-1555400038-63f5ba517a47" 
              alt="Image 3"
              className="rounded-lg w-full h-48 object-cover"
            />
            <img 
              src="https://images.unsplash.com/photo-1554931670-4ebfabf6e7a9" 
              alt="Image 4"
              className="rounded-lg w-full h-48 object-cover"
            />
          </div>
          
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Klik pada gambar untuk zoom in (boleh tambah lightbox).
          </p>
        </ModalContent>
        
        <ModalFooter>
          <button className="px-4 py-2 bg-gray-200 rounded-md">
            Tutup
          </button>
        </ModalFooter>
      </ModalBody>
    </Modal>
  );
}

// ========================================
// CONTOH 4: MODAL CONFIRMATION
// ========================================
export function ConfirmModal({ onConfirm }) {
  return (
    <Modal>
      <ModalTrigger className="bg-red-500 text-white">
        Padam Item
      </ModalTrigger>
      
      <ModalBody>
        <ModalContent>
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg 
                className="w-8 h-8 text-red-600" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold mb-2">Adakah anda pasti?</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Tindakan ini tidak boleh dibatalkan. Item akan dipadam secara kekal.
            </p>
          </div>
        </ModalContent>
        
        <ModalFooter className="gap-3 justify-center">
          <button className="px-6 py-2 bg-gray-200 rounded-md">
            Batal
          </button>
          <button 
            onClick={onConfirm}
            className="px-6 py-2 bg-red-500 text-white rounded-md"
          >
            Ya, Padam
          </button>
        </ModalFooter>
      </ModalBody>
    </Modal>
  );
}

// ========================================
// CONTOH 5: MODAL DENGAN STATE
// ========================================
import { useState } from 'react';

export function StatefulModal() {
  const [step, setStep] = useState(1);
  
  return (
    <Modal>
      <ModalTrigger className="bg-green-500 text-white">
        Multi-Step Modal
      </ModalTrigger>
      
      <ModalBody>
        <ModalContent>
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className={`text-sm ${step >= 1 ? 'text-green-500' : 'text-gray-400'}`}>
                Step 1
              </span>
              <span className={`text-sm ${step >= 2 ? 'text-green-500' : 'text-gray-400'}`}>
                Step 2
              </span>
              <span className={`text-sm ${step >= 3 ? 'text-green-500' : 'text-gray-400'}`}>
                Step 3
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>
          
          {step === 1 && (
            <div>
              <h3 className="text-xl font-bold mb-4">Step 1: Maklumat Asas</h3>
              <p className="text-gray-600 mb-4">Isi maklumat asas anda.</p>
              <input 
                type="text" 
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Nama"
              />
            </div>
          )}
          
          {step === 2 && (
            <div>
              <h3 className="text-xl font-bold mb-4">Step 2: Butiran</h3>
              <p className="text-gray-600 mb-4">Tambah butiran lanjut.</p>
              <textarea 
                className="w-full px-3 py-2 border rounded-lg"
                rows="4"
                placeholder="Butiran"
              />
            </div>
          )}
          
          {step === 3 && (
            <div>
              <h3 className="text-xl font-bold mb-4">Step 3: Pengesahan</h3>
              <p className="text-gray-600 mb-4">Semak semula maklumat anda.</p>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-green-800">✓ Semua maklumat telah diisi</p>
              </div>
            </div>
          )}
        </ModalContent>
        
        <ModalFooter className="gap-3">
          {step > 1 && (
            <button 
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 bg-gray-200 rounded-md"
            >
              Kembali
            </button>
          )}
          {step < 3 ? (
            <button 
              onClick={() => setStep(step + 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Seterusnya
            </button>
          ) : (
            <button className="px-4 py-2 bg-green-500 text-white rounded-md">
              Selesai
            </button>
          )}
        </ModalFooter>
      </ModalBody>
    </Modal>
  );
}

// ========================================
// CONTOH PENGGUNAAN DALAM APP
// ========================================
export function ModalExamples() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Animated Modal Examples
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="font-bold mb-3">Simple Modal</h3>
            <SimpleModal />
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="font-bold mb-3">Form Modal</h3>
            <FormModal />
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="font-bold mb-3">Image Modal</h3>
            <ImageModal />
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="font-bold mb-3">Confirm Modal</h3>
            <ConfirmModal onConfirm={() => console.log('Deleted!')} />
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="font-bold mb-3">Multi-Step Modal</h3>
            <StatefulModal />
          </div>
        </div>
      </div>
    </div>
  );
}
