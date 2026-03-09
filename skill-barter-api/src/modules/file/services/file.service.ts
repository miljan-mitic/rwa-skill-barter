import { Injectable, NotFoundException } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { existsSync } from 'fs';
import path from 'path';
import { IMAGE_TYPE } from 'src/common/enums/image-type.enum';
import * as multer from 'multer';
import { File } from 'multer';
import { randomUUID } from 'crypto';

@Injectable()
export class FileService implements MulterOptionsFactory {
  createMulterOptions(): MulterModuleOptions {
    return {
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          const dest = 'images/' + req.params.imageType;
          cb(null, dest);
        },
        filename: (req, file, cb) => {
          const extension: string = path.parse(file.originalname).ext;
          const uniqueName: string = randomUUID();
          cb(null, `${uniqueName}${extension}`);
        },
      }),
    };
  }

  getFilenamesFromUploadedFiles(files: File[]): string[] {
    const fileNames = files.map((file) => file.filename);
    return fileNames;
  }

  getImagePath(imageType: IMAGE_TYPE, imageName: string): string {
    const imagePath = this.getImageLocation(imageType, imageName);
    if (!existsSync(imagePath)) {
      throw new NotFoundException(
        `Image with filename " ${imageName} " not found`,
      );
    }
    return imagePath;
  }

  getImageLocation(imageType: IMAGE_TYPE, imageName: string) {
    const imagePath = path.resolve(
      process.cwd(),
      'images',
      imageType,
      imageName,
    );
    return imagePath;
  }
}
