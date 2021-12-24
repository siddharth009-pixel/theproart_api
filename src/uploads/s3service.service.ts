import { Injectable, Req, Res } from '@nestjs/common';
import * as AWS from "aws-sdk";

@Injectable()
export class S3Service
{
    AWS_S3_BUCKET = 'theproart';
    s3 = new AWS.S3
    ({
        accessKeyId: 'AKIASOKHUIXCQQ4OOL5P',
        secretAccessKey: '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',
    });

    async uploadFile(file)
    {
        const { originalname,mimetype } = file;

        // console.log(file)
        await this.s3_upload(file.buffer, this.AWS_S3_BUCKET, originalname, mimetype);
    }

    async s3_upload(file, bucket, name, mimetype)
    {
        const params = 
        {
            Bucket: bucket,
            Key: String(name),
            Body: file,
            ACL: "public-read",
            ContentType: mimetype,
            ContentDisposition:"inline",
            CreateBucketConfiguration: 
            {
                LocationConstraint: "ap-south-1"
            }
        };

        console.log(params);

        try
        {
            let s3Response = await this.s3.upload(params).promise();

            console.log(s3Response);
        }
        catch (e)
        {
            console.log(e);
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