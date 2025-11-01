'use client';

import { useState } from 'react';

interface PhotoGalleryProps {
  photos: string[];
  assetPath: string;
}

export default function PhotoGallery({ photos, assetPath }: PhotoGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Generate random heights for masonry effect
  const getRandomHeight = (index: number) => {
    const heights = [250, 300, 350, 280, 320, 270, 330, 290];
    return heights[index % heights.length];
  };

  return (
    <>
      {/* Masonry Grid */}
      <div style={{
        columns: 'auto',
        columnWidth: '300px',
        columnGap: '1.5em',
        maxWidth: '1400px',
        margin: '0 auto 3em auto'
      }}>
        {photos.map((photo, index) => (
          <div 
            key={photo}
            style={{
              breakInside: 'avoid',
              marginBottom: '1.5em',
              cursor: 'pointer',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            onClick={() => setSelectedImage(`${assetPath}/${photo}`)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            }}
          >
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease'
            }}>
              {/* Image placeholder with random height for masonry effect */}
              <div style={{
                width: '100%',
                height: `${getRandomHeight(index)}px`,
                backgroundColor: '#f8f9fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed #e9ecef',
                position: 'relative',
                backgroundImage: `linear-gradient(45deg, #f8f9fa 25%, transparent 25%, transparent 75%, #f8f9fa 75%, #f8f9fa), 
                                 linear-gradient(45deg, #f8f9fa 25%, transparent 25%, transparent 75%, #f8f9fa 75%, #f8f9fa)`,
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 10px 10px'
              }}>
                <div style={{
                  textAlign: 'center',
                  color: '#6c757d'
                }}>
                  <div style={{ fontSize: '3em', marginBottom: '0.2em' }}>📸</div>
                  <div style={{ fontSize: '0.9em', fontWeight: '500' }}>{photo}</div>
                </div>
                
                {/* Hover overlay */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(28, 28, 74, 0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  color: 'white',
                  fontSize: '1.1em',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '0';
                }}
                >
                  Click to view
                </div>
              </div>
              
              {/* Image caption */}
              <div style={{
                padding: '1em',
                textAlign: 'center'
              }}>
                <p style={{
                  margin: 0,
                  color: '#1c1c4a',
                  fontWeight: '500',
                  fontSize: '0.95em'
                }}>
                  Photo {index + 1}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for selected image */}
      {selectedImage && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            cursor: 'pointer'
          }}
          onClick={() => setSelectedImage(null)}
        >
          <div style={{
            maxWidth: '90vw',
            maxHeight: '90vh',
            backgroundColor: 'white',
            padding: '2em',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0, color: '#666' }}>
              Image preview: {selectedImage}
            </p>
            <p style={{ marginTop: '1em', fontSize: '0.9em', color: '#999' }}>
              Click anywhere to close
            </p>
          </div>
        </div>
      )}
    </>
  );
}