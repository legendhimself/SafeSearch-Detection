import { Rekognition } from 'aws-sdk';

const rekognition = new Rekognition({
  region: process.env.region,
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
});

// update the allowed labels
// refer https://docs.aws.amazon.com/rekognition/latest/dg/moderation.html
const allowedLabels = [
  'Gambling',
  'Tobacco',
  'Tobacco Products',
  'Smoking',
  'Suggestive',
  'Male Swimwear Or Underwear',
  'Female Swimwear Or Underwear',
];

/**
 * Validate image using AWS Rekognition
 * @param imageUrl - image URL
 * @returns if the image is unsafe and the key
 */
export const validateImage = async (imageUrl: string) => {
  const splitted = imageUrl.split('/');
  const imageName = splitted[splitted.length - 1];

  const { ModerationLabels = [] } = await rekognition
    .detectModerationLabels({
      Image: {
        S3Object: {
          Bucket: process.env.bucketName,
          Name: imageName,
        },
      },
      MinConfidence: 90,
    })
    .promise();

  // const dirtyLabels =
  //   ModerationLabels?.filter(
  //     (label) =>
  //       label.ParentName !== '' &&
  //       label.Name !== '' &&
  //       !(
  //         allowedLabels.includes(label.Name!) ||
  //         allowedLabels.includes(label.ParentName!)
  //       ),
  //   ) ?? [];
  // return { unsafe: dirtyLabels.length !== 0, key: imageName };
  return {
    unsafe: shouldDelete(ModerationLabels),
    key: imageName,
  };
};

function shouldDelete(images: Rekognition.ModerationLabels) {
  if (images.length === 0) return false;
  return images.some((label) => {
    if (label.ParentName === '' && label.Name === 'Suggestive') return false;

    if (allowedLabels.includes(label.Name!)) return false;
    return !allowedLabels.includes(label.ParentName!);
  });
}
