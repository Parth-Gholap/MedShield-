import { manipulateAsync, SaveFormat, Action } from 'expo-image-manipulator';

export interface CropRect {
  originX: number;
  originY: number;
  width: number;
  height: number;
}

export interface ProcessedImageResult {
  uri: string;
  width: number;
  height: number;
}

/**
 * Calculates crop rectangle in photo coordinates given:
 * - photo width and height
 * - camera view container width and height
 * - guide frame width and height
 */
export function calculateCropRect(
  photoWidth: number,
  photoHeight: number,
  containerWidth: number,
  containerHeight: number,
  frameWidth: number,
  frameHeight: number
): CropRect {
  // If invalid container dimensions, fallback to center 80% width with 0.55 aspect ratio
  if (!photoWidth || !photoHeight || !containerWidth || !containerHeight) {
    const fallbackWidth = Math.round((photoWidth || 1000) * 0.8);
    const fallbackHeight = Math.round(fallbackWidth * 0.55);
    return {
      originX: Math.max(0, Math.round(((photoWidth || 1000) - fallbackWidth) / 2)),
      originY: Math.max(0, Math.round(((photoHeight || 1000) - fallbackHeight) / 2)),
      width: fallbackWidth,
      height: fallbackHeight,
    };
  }

  // Camera preview covers the container (scaleType FILL)
  const scale = Math.max(photoWidth / containerWidth, photoHeight / containerHeight);

  // Frame position in container (centered)
  const frameX = (containerWidth - frameWidth) / 2;
  const frameY = (containerHeight - frameHeight) / 2;

  // Offset of the rendered photo within the container
  const offsetX = (containerWidth - photoWidth / scale) / 2;
  const offsetY = (containerHeight - photoHeight / scale) / 2;

  // Map to photo pixel space
  const originX = Math.max(0, Math.round((frameX - offsetX) * scale));
  const originY = Math.max(0, Math.round((frameY - offsetY) * scale));

  const width = Math.min(photoWidth - originX, Math.max(1, Math.round(frameWidth * scale)));
  const height = Math.min(photoHeight - originY, Math.max(1, Math.round(frameHeight * scale)));

  return { originX, originY, width, height };
}

/**
 * Crops the photo to the specified rectangle, resizes to max 1280 px width if larger,
 * and compresses as JPEG with quality 0.7.
 */
export async function cropAndCompressPhoto(
  uri: string,
  cropRect: CropRect
): Promise<ProcessedImageResult> {
  const actions: Action[] = [
    {
      crop: {
        originX: Math.max(0, Math.floor(cropRect.originX)),
        originY: Math.max(0, Math.floor(cropRect.originY)),
        width: Math.max(1, Math.floor(cropRect.width)),
        height: Math.max(1, Math.floor(cropRect.height)),
      },
    },
  ];

  // Downscale if width > 1280 px (preserving aspect ratio)
  if (cropRect.width > 1280) {
    actions.push({
      resize: {
        width: 1280,
      },
    });
  }

  const result = await manipulateAsync(uri, actions, {
    compress: 0.7,
    format: SaveFormat.JPEG,
  });

  return {
    uri: result.uri,
    width: result.width,
    height: result.height,
  };
}
