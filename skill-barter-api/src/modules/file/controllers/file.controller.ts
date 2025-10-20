import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from '../services/file.service';
import { ImageType } from 'src/common/enums/image-type.enum';
import type { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { File } from 'multer';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('image/:imageType/:imageName')
  getImage(
    @Param('imageType') imageType: ImageType,
    @Param('imageName') imageName: string,
    @Res() res: Response,
  ) {
    const imagePath = this.fileService.getImagePath(imageType, imageName);
    return res.sendFile(imagePath);
  }

  @Post('uploadImages/:imageType')
  @UseInterceptors(
    FilesInterceptor('images[]', 10, new FileService().createMulterOptions()),
  )
  uploadImages(
    @UploadedFiles() files: File[],
    @Param('imageType') imageType: ImageType,
  ) {
    console.log({ imageType });
    return this.fileService.getFilenamesFromUploadedFiles(files);
  }
}
