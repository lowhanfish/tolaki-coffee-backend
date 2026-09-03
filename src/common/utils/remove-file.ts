import path from 'path';
import * as fs from 'fs';
import * as fsPromise from 'fs/promises';

export const removeSingleFile = async (filePath: string): Promise<boolean> => {
  if (!filePath) return false;
  try {
    const absolutePath = path.resolve(process.cwd(), filePath);
    if (fs.existsSync(absolutePath)) {
      await fsPromise.unlink(absolutePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Gagal menghapus file di ${filePath}:`, error);
    return false;
  }
};