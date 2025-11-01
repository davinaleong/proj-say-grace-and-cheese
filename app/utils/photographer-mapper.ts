/**
 * Maps a photographer's name to their corresponding asset path
 * @param photographerName - The photographer's name (case insensitive)
 * @returns The asset path in the format "/assets/{photographer-name-lowercase}"
 * 
 * Examples:
 * - "John Smith" → "/assets/john-smith"
 * - "Sarah O'Connor" → "/assets/sarah-oconnor"
 * - "Marie-Claire Dubois" → "/assets/marie-claire-dubois"
 */
export const mapPhotographerToAsset = (photographerName: string): string => {
  const normalizedName = photographerName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, ''); // Remove special characters except hyphens
  
  return `/assets/${normalizedName}`;
};

/**
 * Maps a photographer's name to a specific file within their asset directory
 * @param photographerName - The photographer's name
 * @param fileName - The specific file name (including extension)
 * @returns The full asset path to the specific file
 * 
 * Example:
 * - mapPhotographerToAssetFile("John Smith", "portrait.jpg") → "/assets/john-smith/portrait.jpg"
 */
export const mapPhotographerToAssetFile = (
  photographerName: string, 
  fileName: string
): string => {
  const basePath = mapPhotographerToAsset(photographerName);
  return `${basePath}/${fileName}`;
};

/**
 * Creates a mapper object for multiple photographers
 * @param photographerNames - Array of photographer names
 * @returns Object mapping photographer names to their asset paths
 */
export const createPhotographerAssetMap = (photographerNames: string[]) => {
  return photographerNames.reduce((acc, name) => {
    acc[name] = mapPhotographerToAsset(name);
    return acc;
  }, {} as Record<string, string>);
};