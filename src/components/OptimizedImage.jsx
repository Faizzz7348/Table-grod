import { useState, useEffect, memo } from 'react';

/**
 * Optimized Image Component dengan lazy loading dan error handling
 * Mengurangi lag dengan loading gambar secara progresif
 */
export const OptimizedImage = memo(function OptimizedImage({ 
  src, 
  alt = '', 
  width, 
  height, 
  className = '',
  style = {},
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3ELoading...%3C/text%3E%3C/svg%3E',
  onLoad,
  onError
}) {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    // Preload image
    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
      setHasError(false);
      onLoad?.();
    };

    img.onerror = () => {
      setHasError(true);
      setIsLoading(false);
      onError?.();
    };

    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, onLoad, onError]);

  const imageStyle = {
    ...style,
    transition: 'opacity 0.3s ease-in-out',
    opacity: isLoading ? 0.5 : 1,
  };

  if (hasError) {
    return (
      <div 
        className={className}
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f0f0f0',
          color: '#999',
          fontSize: '12px'
        }}
      >
        <i className="pi pi-image" style={{ marginRight: '5px' }}></i>
        Image not available
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={imageStyle}
      loading="lazy"
      decoding="async"
    />
  );
});

export default OptimizedImage;
