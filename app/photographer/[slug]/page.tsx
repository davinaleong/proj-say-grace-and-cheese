import { notFound } from 'next/navigation';
import { mapPhotographerToAsset } from '../../utils/photographer-mapper';
import Title from '../../components/Title';
import PhotoGallery from './PhotoGallery';
import BackLink from './BackLink';

// This would typically come from a database or config
const photographerData: Record<string, { name: string; photos: string[] }> = {
  'cindy': {
    name: 'Cindy',
    photos: ['0001.jpg', '0002.jpg', '0003.jpg']
  },
  'davina': {
    name: 'Davina',
    photos: ['0001.jpg', '0002.jpg', '0003.jpg', '0004.jpg', '0005.jpg', '0006.jpg', '0007.jpg', '0008.jpg', '0009.jpg', '0010.jpg', '0011.jpg', '0012.jpg', '0013.jpg', '0014.jpg', '0015.jpg', '0016.jpg']
  },
  'may-hwee': {
    name: 'May Hwee',
    photos: ['0001.jpg', '0002.jpg', '0003.jpg', '0004.jpg', '0005.jpg', '0006.jpg', '0007.jpg', '0008.jpg', '0009.jpg', '0010.jpg', '0011.jpg']
  },
  'vincent': {
    name: 'Vincent',
    photos: ['0001.jpg', '0002.jpg', '0003.jpg', '0004.jpg', '0005.jpg', '0006.jpg', '0007.jpg']
  },
  'wendy': {
    name: 'Wendy',
    photos: ['0001.jpg', '0002.jpg', '0003.jpg', '0004.jpg', '0005.jpg', '0006.jpg', '0007.jpg', '0008.jpg']
  },
  'yy': {
    name: 'yy',
    photos: ['0001.jpg', '0002.jpg']
  }
};

interface PhotographerPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PhotographerPage({ params }: PhotographerPageProps) {
  const { slug } = await params;
  const photographer = photographerData[slug];
  
  if (!photographer) {
    notFound();
  }

  const assetPath = mapPhotographerToAsset(photographer.name);

  return (
    <div style={{
      backgroundColor: '#ffdbdc',
      minHeight: '100vh',
      padding: '2em',
      fontFamily: 'Montserrat, sans-serif'
    }}>
      {/* Header */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '2em' 
      }}>
        <Title />
        <h1 style={{
          fontSize: '2.5em',
          color: '#1c1c4a',
          marginBottom: '0.5em',
          fontWeight: 'bold'
        }}>
          {photographer.name}&apos;s Gallery
        </h1>
        <p style={{
          fontSize: '1.2em',
          color: '#666',
          marginBottom: '1em'
        }}>
          {photographer.photos.length} beautiful moments captured
        </p>
      </div>

      {/* Gallery Content */}
      {photographer.photos.length > 0 ? (
        <PhotoGallery 
          photos={photographer.photos}
          assetPath={assetPath}
        />
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '4em 2em',
          color: '#666'
        }}>
          <div style={{ fontSize: '4em', marginBottom: '0.5em' }}>📷</div>
          <h2>No photos available</h2>
          <p>Check back soon for new photos!</p>
        </div>
      )}

      {/* Back button */}
      <div style={{ textAlign: 'center' }}>
        <BackLink href="/photographers">
          Back to Photographers
        </BackLink>
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