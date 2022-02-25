import { Injectable } from '@nestjs/common';
import { S3Service } from './s3service.service';

@Injectable()
export class UploadsService {
  constructor(private s3Service: S3Service) {}
  
  findAll() {
    return `This action returns all uploads`;
  }

  findOne(id: number) {
    return `This action returns a #${id} upload`;
  }

  remove(id: number) {
    return `This action removes a #${id} upload`;
  }

  // async deleteObject(Key:string) {
  //   const details={
  //     Key,
  //     Bucket: 'theproart'
  //   }
  //   const result=await this.s3Service.s3_delete(details)
  //   console.log('result',result);
  //   return result;
  // }


}
