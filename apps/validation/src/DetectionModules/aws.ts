import { Rekognition } from 'aws-sdk';

const rekognition = new Rekognition({
  region: process.env.region,
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
});

// update the allowed labels
// https://docs.aws.amazon.com/rekognition/latest/dg/moderation.html
const allowedTopLevelLabels = ['Gambling', 'Tobacco'];
const allowedSecondLevelLabels = [
  'Female Swimwear Or Underwear',
  'Male Swimwear Or Underwear',
];
/**
 * Validate image using AWS Rekognition
 * @param imageUrl - image URL
 * @returns if the image is unsafe and the key
 */
export const validateImage = async (imageUrl: string) => {
  const splitted = imageUrl.split('/');
  const imageName = splitted[splitted.length - 1];

  const { ModerationLabels } = await rekognition
    .detectModerationLabels({
      Image: {
        S3Object: {
          Bucket: process.env.bucketName,
          Name: imageName,
        },
      },
      MinConfidence: 70,
    })
    .promise();

  const topLevelLabels =
    ModerationLabels?.filter(
      (label) =>
        !allowedSecondLevelLabels.includes(label.Name!) ||
        !allowedTopLevelLabels.includes(label.ParentName!),
    ) ?? [];

  return { unsafe: topLevelLabels.length !== 0, key: imageName };
};
