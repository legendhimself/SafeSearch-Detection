// @todo: complete this

// import { fetchBuffer } from '@lib';
// import * as tf from '@tensorflow/tfjs-node';
// import * as nsfw from 'nsfwjs';
// let model: nsfw.NSFWJS | null = null;

// export const validateImage = async (imageUrl: string) => {
//   const buffer = await fetchBuffer(imageUrl);
//   model ??= await nsfw.load(); // To load a local model, nsfw.load('file://./path/to/model/')
//   // Image must be in tf.tensor3d format
//   // you can convert image to tf.tensor3d with tf.node.decodeImage(Uint8Array,channels)
//   const image = tf.node.decodeImage(buffer, 3) as tf.Tensor3D;
//   const predictions = await model.classify(image);
//   image.dispose(); // Tensor memory must be managed explicitly (it is not sufficient to let a tf.Tensor go out of scope for its memory to be released).
//   console.log(predictions);
// };
