import Link from 'next/link';
import { notFound } from 'next/navigation';
import { mapPhotographerToAsset } from '../../utils/photographer-mapper';

// This would typically come from a database or config
const photographerData: Record<string, { name: string; photos: string[] }> = {
  'cindy': {
    name: 'Cindy',
    photos: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg']
  },
  'davina': {
    name: 'Davina',
    photos: ['image1.jpg', 'image2.jpg', 'image3.jpg']
  },
  'may-hwee': {
    name: 'May Hwee',
    photos: ['pic1.jpg', 'pic2.jpg', 'pic3.jpg']
  },
  'vincent': {
    name: 'Vincent',
    photos: ['shot1.jpg', 'shot2.jpg', 'shot3.jpg']
  },
  'wendy': {
    name: 'Wendy',
    photos: ['capture1.jpg', 'capture2.jpg', 'capture3.jpg']
  }
};

interface PhotographerPageProps {
  params: {
    slug: string;
  };
}

export default function PhotographerPage({ params }: PhotographerPageProps) {
  const { slug } = params;
  const photographer = photographerData[slug];
  
  if (!photographer) {
    notFound();
  }

  const assetPath = mapPhotographerToAsset(photographer.name);

  return (
    <div>
      <h1>{photographer.name}&apos;s Gallery</h1>
      <p>Asset path: {assetPath}</p>
      
      <div>
        <h2>Photos</h2>
        {photographer.photos.length > 0 ? (
          <div>
            {photographer.photos.map((photo, index) => (
              <div key={photo}>
                <h3>Photo {index + 1}: {photo}</h3>
                <p>Path: {assetPath}/{photo}</p>
                {/* Placeholder for actual image - uncomment when images are available */}
                {/*
                <Image
                  src={`${assetPath}/${photo}`}
                  alt={`${photographer.name} - ${photo}`}
                  width={400}
                  height={300}
                />
                */}
                <div style={{ 
                  width: '400px', 
                  height: '300px', 
                  backgroundColor: '#f0f0f0', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  border: '1px solid #ccc'
                }}>
                  Image placeholder: {photo}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No photos available</p>
        )}
      </div>
      
      <div>
        <Link href="/photographers">← Back to photographers</Link>
      </div>
    </div>
  );
}

// Generate static params for all photographers
export async function generateStaticParams() {
  return Object.keys(photographerData).map((slug) => ({
    slug,
  }));
}