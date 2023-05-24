import fs from 'node:fs';
import path from 'node:path';

export const clearImage = (filePath) => {
  filePath = path.join(process.cwd(), filePath);
  fs.unlink(filePath, (err) => console.error(err));
};
