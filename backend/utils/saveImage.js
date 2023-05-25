import fs from 'node:fs';
import path from 'node:path';

const uploadDir = path.resolve('images');

export const saveImage = async (image) => {
  const [name, ext] = image.filename.split('.');
  const newName = `${name}.${ext}`;
  const uploadPath = path.join(uploadDir, newName);
  const fileStream = fs.createWriteStream(uploadPath);
  const file = await image.toBuffer();

  fileStream.write(file);

  return newName;
};
