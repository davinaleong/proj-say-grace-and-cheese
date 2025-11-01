import Link from 'next/link';
import { mapPhotographerToAsset } from '../utils/photographer-mapper';

// List of photographers - this could come from a database or config file
const photographers = [
  'Cindy',
  'Davina',
  'May Hwee',
  'Vincent',
  'Wendy'
];

export default function PhotographersPage() {
  return (
    <div>
      <h1>Photographers</h1>
      <p>Select a photographer to view their gallery:</p>
      
      <ul>
        {photographers.map((photographer) => (
          <li key={photographer}>
            <Link href={`/photographer/${photographer.toLowerCase().replace(/\s+/g, '-')}`}>
              {photographer}
            </Link>
            <p>Asset path: {mapPhotographerToAsset(photographer)}</p>
          </li>
        ))}
      </ul>
      
      <Link href="/">← Back to home</Link>
    </div>
  );
}