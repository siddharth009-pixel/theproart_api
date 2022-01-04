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
          'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=772&q=80',
        thumbnail:
          'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=772&q=80',
      },
    ];
  }
}
