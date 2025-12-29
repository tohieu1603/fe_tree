'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  discount: number | null;
}

const LENS_SIZE = 120; // Larger lens for better visibility
const ZOOM_LEVEL = 3; // Higher zoom level

export default function ProductGallery({ images, productName, discount }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showLens, setShowLens] = useState(false);
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const [backgroundPosition, setBackgroundPosition] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const selectedImage = images[selectedIndex] || '';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;

    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate lens position (centered on cursor)
    const lensX = Math.max(0, Math.min(x - LENS_SIZE / 2, rect.width - LENS_SIZE));
    const lensY = Math.max(0, Math.min(y - LENS_SIZE / 2, rect.height - LENS_SIZE));

    // Calculate background position for zoomed view
    const bgX = (x / rect.width) * 100;
    const bgY = (y / rect.height) * 100;

    setLensPosition({ x: lensX, y: lensY });
    setBackgroundPosition({ x: bgX, y: bgY });
  };

  const handleMouseEnter = () => {
    setShowLens(true);
  };

  const handleMouseLeave = () => {
    setShowLens(false);
  };

  return (
    <div>
      {/* Main Image with Magnifying Lens */}
      <div
        ref={imageContainerRef}
        className="relative aspect-square bg-stone-100 rounded-lg overflow-hidden mb-3 cursor-none"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsZoomed(true)}
      >
        {selectedImage ? (
          <>
            <Image
              src={selectedImage}
              alt={productName}
              fill
              className="object-cover"
              priority
            />
            {/* Magnifying Lens */}
            {showLens && (
              <div
                className="absolute pointer-events-none border-2 border-amber-600 rounded shadow-lg z-20"
                style={{
                  width: LENS_SIZE,
                  height: LENS_SIZE,
                  left: lensPosition.x,
                  top: lensPosition.y,
                  backgroundImage: `url(${selectedImage})`,
                  backgroundPosition: `${backgroundPosition.x}% ${backgroundPosition.y}%`,
                  backgroundSize: `${ZOOM_LEVEL * 100}%`,
                  backgroundRepeat: 'no-repeat',
                }}
              />
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-20 h-20 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {discount && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded z-10">
            -{discount}%
          </span>
        )}
        {/* Zoom hint */}
        {!showLens && (
          <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded flex items-center gap-1 z-10">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
            Di chuot de phong to
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.slice(0, 5).map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`relative aspect-square rounded overflow-hidden border-2 transition ${
                i === selectedIndex ? 'border-amber-700' : 'border-transparent hover:border-stone-300'
              }`}
            >
              <Image src={img} alt={`${productName} ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox / Zoom Modal */}
      {isZoomed && selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 text-white hover:text-stone-300 transition"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
                }}
                className="absolute left-4 text-white hover:text-stone-300 transition"
              >
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex((selectedIndex + 1) % images.length);
                }}
                className="absolute right-4 text-white hover:text-stone-300 transition"
              >
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          <div className="relative max-w-4xl max-h-[80vh] w-full h-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={selectedImage}
              alt={productName}
              fill
              className="object-contain"
            />
          </div>

          {/* Thumbnails in lightbox */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex(i);
                  }}
                  className={`w-12 h-12 rounded overflow-hidden border-2 transition ${
                    i === selectedIndex ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt="" width={48} height={48} className="object-cover w-full h-full" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
