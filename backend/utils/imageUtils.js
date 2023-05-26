import fs from 'node:fs';
import path from 'node:path';

export default {
  saveImage: async (image) => {
    const uploadDir = path.resolve('backend', 'images');
    const [name, ext] = image.filename.split('.');
    const newName = `${name}-${Date.now()}.${ext}`;
    const uploadPath = path.join(uploadDir, newName);
    const fileStream = fs.createWriteStream(uploadPath);
    const file = await image.toBuffer();

    fileStream.write(file);

    return newName;
  },
  clearImage: (filePath) => {
    filePath = path.join(process.cwd(), filePath);
    fs.unlink(filePath, (err) => console.error(err));
  },
};
