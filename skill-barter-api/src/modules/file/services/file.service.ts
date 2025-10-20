import { Injectable, NotFoundException } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { existsSync } from 'fs';
import path from 'path';
import { ImageType } from 'src/common/enums/image-type.enum';
import * as multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { File } from 'multer';

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
          const uniqueName: string = uuidv4();
          cb(null, `${uniqueName}${extension}`);
        },
      }),
    };
  }

  getFilenamesFromUploadedFiles(files: File[]): string[] {
    const fileNames = files.map((file) => file.filename);
    return fileNames;
  }

  getImagePath(imageType: ImageType, imageName: string): string {
    const imagePath = this.getImageLocation(imageType, imageName);
    if (!existsSync(imagePath)) {
      throw new NotFoundException(
        `Image with filename " ${imageName} " not found`,
      );
    }
    return imagePath;
  }

  getImageLocation(imageType: ImageType, imageName: string) {
    const imagePath = path.resolve(
      process.cwd(),
      'images',
      imageType,
      imageName,
    );
    return imagePath;
  }
}
