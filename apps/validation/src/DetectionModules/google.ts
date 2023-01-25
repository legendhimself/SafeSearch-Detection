import { ImageAnnotatorClient } from '@google-cloud/vision';
import { fetchBuffer } from '@libs';

// refer https://cloud.google.com/vision/docs/reference/rpc/google.cloud.vision.v1#likelihood
const annotations = ['VERY_LIKELY', 'LIKELY', 'POSSIBLE'];

/**
 * Validate image using AWS Rekognition
 * @param imageUrl - image URL
 * @returns if the image is unsafe and the key
 */
export const validateImage = async (imageUrl: string) => {
  const splitted = imageUrl.split('/');
  const imageName = splitted[splitted.length - 1];
  const buffer = await fetchBuffer(imageUrl);
  const client = new ImageAnnotatorClient({
    keyFile: process.env.credFileName,
  });

  const [result] = await client.safeSearchDetection(buffer);
  const detections = result.safeSearchAnnotation;

  const unsafe = annotations.some(
    (annotation) =>
      detections?.adult === annotation ||
      detections?.medical === annotation ||
      detections?.spoof === annotation ||
      detections?.violence === annotation ||
      detections?.racy === annotation,
  );

  return { unsafe, key: imageName };
};
