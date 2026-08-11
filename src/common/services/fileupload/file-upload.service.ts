import { Inject, Injectable } from '@nestjs/common';
import { CLOUDINARY } from '../../constants';
import { v2 as Cloudinary, UploadApiResponse } from 'cloudinary';
import { Image } from '../../types';

@Injectable()
export class FilteUploadService {
  constructor(@Inject(CLOUDINARY) private cloudinary: typeof Cloudinary) {}

  // upload file
  async uploadCloud(
    buffer: Buffer,
    folder: string,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      this.cloudinary.uploader
        .upload_stream({ folder }, (error, result) => {
          if (error) return reject(error);
          return resolve(result!);
        })
        .end(buffer);
    });
  }
  async saveFileToCloud(files: Express.Multer.File[], folder: string) {
    let savedFiles: Image[] = [];

    for (const file of files) {
      const buffer = file.buffer;

      const { secure_url, public_id } = await this.uploadCloud(buffer, folder);
      savedFiles.push({ secure_url, public_id });
    }
    return savedFiles;
  }
}
