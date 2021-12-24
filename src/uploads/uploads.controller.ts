import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { S3Service } from './s3service.service';
import { UploadsService } from './uploads.service';

@Controller('attachments')
@ApiTags('UploadFiles')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService,private s3Service: S3Service) {}

  @Post()
  @UseInterceptors(FilesInterceptor('attachment[]'))
  uploadFile(@UploadedFiles() attachment: Array<Express.Multer.File>) {
    console.log(attachment);
    this.s3Service.uploadFile(attachment[0]);
    return [
      {
        id: '883',
        original:
          'https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/881/aatik-tasneem-7omHUGhhmZ0-unsplash%402x.png',
        thumbnail:
          'https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/881/conversions/aatik-tasneem-7omHUGhhmZ0-unsplash%402x-thumbnail.jpg',
      },
    ];
  }
}
