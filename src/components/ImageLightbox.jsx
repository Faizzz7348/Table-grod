import { useRef, useState } from "react";

// Global variable to track current open gallery
let currentOpenGallery = null;

/**
 * ImageLightbox Component
 * A modern lightbox gallery using LightGallery library
 * Features: thumbnails, zoom, fullscreen, lazy loading
 */
export function ImageLightbox({ images, rowId }) {
  const galleryRef = useRef(null);
  const containerRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const isInitialized = useRef(false);

  const handleImageClick = async (e) => {
    e.preventDefault();
    
    // Close any currently open gallery
    if (currentOpenGallery && currentOpenGallery !== galleryRef.current) {
      try {
        currentOpenGallery.destroy();
        currentOpenGallery = null;
      } catch (err) {
        console.warn("Error closing previous gallery:", err);
      }
    }

    // Initialize gallery if not already done
    if (!isInitialized.current && containerRef.current) {
      try {
        // Dynamically import lightgallery
        const { default: lightGallery } = await import("lightgallery");
        const lgThumbnail = await import("lightgallery/plugins/thumbnail");
        const lgZoom = await import("lightgallery/plugins/zoom");
        const lgFullscreen = await import("lightgallery/plugins/fullscreen");

        // Import CSS
        await import("lightgallery/css/lightgallery.css");
        await import("lightgallery/css/lg-thumbnail.css");
        await import("lightgallery/css/lg-zoom.css");
        await import("lightgallery/css/lg-fullscreen.css");

        // Initialize gallery
        const gallery = lightGallery(containerRef.current, {
          licenseKey: "GPLv3",
          plugins: [lgThumbnail.default, lgZoom.default, lgFullscreen.default],
          speed: 500,
          download: false,
          dynamic: true,
          dynamicEl: images.map((img, idx) => ({
            src: typeof img === 'object' ? img.url : img,
            thumb: typeof img === 'object' ? img.url : img,
            subHtml: typeof img === 'object' && img.caption 
              ? `<h4>${img.caption}</h4>${img.description ? `<p>${img.description}</p>` : ''}` 
              : `<p>Image ${idx + 1}</p>`
          })),
          thumbnail: true,
          animateThumb: true,
          thumbWidth: 100,
          thumbHeight: "80px",
          thumbMargin: 5,
          showThumbByDefault: true,
          mode: "lg-fade",
          closable: true,
          closeOnTap: true,
        });

        galleryRef.current = gallery;
        currentOpenGallery = gallery;
        isInitialized.current = true;

        // Add close listener to cleanup
        gallery.outer.addEventListener('lgAfterClose', () => {
          if (currentOpenGallery === gallery) {
            currentOpenGallery = null;
          }
        });

        // Open gallery
        gallery.openGallery(0);
      } catch (error) {
        console.error("Failed to load LightGallery:", error);
      }
    } else if (galleryRef.current) {
      // Gallery already initialized, just open it
      currentOpenGallery = galleryRef.current;
      galleryRef.current.openGallery(0);
    }
  };

  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center mx-auto">
        <div className="flex items-center justify-center w-10 h-8 rounded-lg border border-gray-200 bg-gray-50">
          <span className="text-xs text-gray-400">No Image</span>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      width: '100%',
      height: '100%'
    }}>
      {/* Clickable image preview */}
      <div
        onClick={handleImageClick}
        style={{ 
          position: 'relative', 
          width: '50px', 
          height: '40px',
          cursor: 'pointer'
        }}
      >
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
            <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}
        <img
          src={typeof images[0] === 'object' ? images[0].url : images[0]}
          alt={typeof images[0] === 'object' && images[0].caption ? images[0].caption : "Image"}
          style={{ 
            width: '100%', 
            height: '100%',
            objectFit: 'cover',
            borderRadius: '4px',
            border: '1px solid #e5e7eb',
            transition: 'opacity 0.3s'
          }}
          className={imageLoaded ? 'opacity-100' : 'opacity-0'}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
        />
        
        {/* Count badge inside image */}
        {images.length > 1 && (
          <span style={{
            position: 'absolute',
            bottom: '3px',
            right: '3px',
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            color: 'white',
            fontSize: '9px',
            fontWeight: '600',
            padding: '2px 5px',
            borderRadius: '3px',
            lineHeight: '1',
            pointerEvents: 'none',
            zIndex: 1
          }}>
            +{images.length - 1}
          </span>
        )}
      </div>
    </div>
  );
}

export default ImageLightbox;
