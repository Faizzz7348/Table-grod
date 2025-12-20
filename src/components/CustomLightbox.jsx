import React from 'react';

export default function CustomLightbox({ images, visible, currentIndex, onHide, onPrev, onNext }) {
    if (!visible) return null;

    return (
        <div 
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.95)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
            }}
            onClick={onHide}
        >
            {/* Close Button */}
            <button
                onClick={onHide}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    color: 'white',
                    fontSize: '30px',
                    cursor: 'pointer',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10000
                }}
            >
                ×
            </button>

            {/* Image Container */}
            <div 
                style={{ 
                    maxWidth: '90vw', 
                    maxHeight: '80vh',
                    position: 'relative'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    src={images[currentIndex]}
                    alt={`Image ${currentIndex + 1}`}
                    style={{
                        maxWidth: '100%',
                        maxHeight: '80vh',
                        objectFit: 'contain'
                    }}
                />
            </div>

            {/* Navigation Buttons */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onPrev();
                        }}
                        style={{
                            position: 'absolute',
                            left: '20px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'rgba(255, 255, 255, 0.2)',
                            border: 'none',
                            color: 'white',
                            fontSize: '40px',
                            cursor: 'pointer',
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        ‹
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onNext();
                        }}
                        style={{
                            position: 'absolute',
                            right: '20px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'rgba(255, 255, 255, 0.2)',
                            border: 'none',
                            color: 'white',
                            fontSize: '40px',
                            cursor: 'pointer',
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        ›
                    </button>
                </>
            )}

            {/* Image Counter */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: 'white',
                    fontSize: '18px',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    padding: '8px 16px',
                    borderRadius: '20px'
                }}
            >
                {currentIndex + 1} / {images.length}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div
                    style={{
                        position: 'absolute',
                        bottom: '60px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        gap: '10px',
                        maxWidth: '90vw',
                        overflow: 'auto',
                        padding: '10px'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {images.map((img, idx) => (
                        <img
                            key={idx}
                            src={img}
                            alt={`Thumb ${idx + 1}`}
                            onClick={() => onNext(idx)}
                            style={{
                                width: '60px',
                                height: '60px',
                                objectFit: 'cover',
                                cursor: 'pointer',
                                border: idx === currentIndex ? '3px solid white' : '3px solid transparent',
                                borderRadius: '4px',
                                opacity: idx === currentIndex ? 1 : 0.6
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
