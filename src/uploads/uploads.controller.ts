import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Delete,
  Body,
  Req,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { S3Service } from './s3service.service';
import { UploadsService } from './uploads.service';

export class deleteObjectDTO {
  Key: string[];
}

@Controller('attachments')
@ApiTags('UploadFiles')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService, private s3Service: S3Service) { }

  @Post()
  @UseInterceptors(FilesInterceptor('attachment'))
  async uploadFile(@Req() req, @UploadedFiles() attachment: Array<Express.Multer.File>) {
    if (!attachment || attachment.length === 0) {
      return;
    }

    const response = await this.s3Service.uploadFiles(attachment);

    console.log("end")
    return response;
  }


  @Post('delete')
  async deleteFile(@Body() deleteObject: deleteObjectDTO) {
    console.log('deleteObject',deleteObject)
    return await this.s3Service.s3_delete(deleteObject)
  }

}
