import { Injectable, Req, Res } from '@nestjs/common';
import * as AWS from "aws-sdk";
import slugify from 'slugify';
const shortid = require('shortid');
export interface deleteDto {
    Key: string[];
}

@Injectable()
export class S3Service {
    AWS_S3_BUCKET = 'theproart';
    s3 = new AWS.S3
        ({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });

    async uploadFile(file) {
        const { originalname, mimetype } = file;

        return await this.s3_upload(file.buffer, this.AWS_S3_BUCKET, originalname, mimetype);
    }

    async uploadFiles(files) {

        let response = [];
        for (const file of files) {
            try {
                let fileName = `${shortid.generate()}-${slugify(file.originalname)}`;
                const res = await this.s3_upload(file.buffer, this.AWS_S3_BUCKET, fileName, file.mimetype);
                response.push(res);

            }
            catch (err) {
                console.log(err);
            }
        }
        return response;


    }

    async s3_upload(file, bucket, name, mimetype) {
        const params =
        {
            Bucket: bucket,
            Key: String(name),
            Body: file,
            ACL: "public-read",
            ContentType: mimetype,
            ContentDisposition: "inline",
            CreateBucketConfiguration:
            {
                LocationConstraint: "ap-south-1"
            }
        };
        try {
            return await this.s3.upload(params).promise();
        }
        catch (e) {
            console.log(e);
        }
    }


    async fileUpload(params) {
        return new Promise((resolve, reject) => {
            (async () => {
                this.s3.upload(params, (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(data);
                    }
                })
            })();
        });
    }
    
    async s3_delete(params: deleteDto) {
        try
        {

        let objects = [];
        if (params) {
            params.Key.forEach((key) => {
                objects.push({ Key: key })
            })

            let options = {
                Bucket: this.AWS_S3_BUCKET,
                Delete: {
                    Objects: objects
                }
            };

            try {
                return await this.s3.deleteObjects(options).promise()

            }
            catch (err) {
                console.log(err)
                return err;
            }
        }
    }catch(err){
        console.log('err',err);
    }
    }

    
}

// A couple of points to look out for here are - ACL which makes your file readable to the public. Else AWS shows "Access Denied". ContentDisposition: "inline" and ContentType - so that your file is viewed by the browser and not downloaded.

// And the response structure looks like this
// {
//   ETag: '"<unique-key>"',
//   Location: 'https://<bucket>.s3.amazonaws.com/<filename>',
//   key: '<filename>',
//   Key: '<filename>',
//   Bucket: '<bucket>'
// }