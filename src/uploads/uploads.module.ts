import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { S3Service } from './s3service.service';

@Module({
  controllers: [UploadsController],
  providers: [UploadsService,S3Service],
})
export class UploadsModule {}
