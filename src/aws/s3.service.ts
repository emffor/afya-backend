import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

@Injectable()
export class S3Service {
  private s3: S3;
  private bucketName: string = process.env.S3_BUCKET || 'my-bucket';

  constructor() {
    this.s3 = new S3({
      endpoint: process.env.S3_ENDPOINT || 'http://localhost:4566',
      s3ForcePathStyle: true, 
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test',
      region: process.env.AWS_REGION || 'us-east-1',
    });
  }

  async createBucketIfNotExists(): Promise<void> {
    try {
      await this.s3.headBucket({ Bucket: this.bucketName }).promise();
      // O bucket já existe
    } catch (error) {
      if (error.statusCode === 404) {
        await this.s3.createBucket({ Bucket: this.bucketName }).promise();
      }
    }
  }

  async uploadFile(fileBuffer: Buffer, fileName: string, contentType: string): Promise<string> {
    await this.createBucketIfNotExists();

    const params: S3.PutObjectRequest = {
      Bucket: this.bucketName,
      Key: fileName,
      Body: fileBuffer,
      ContentType: contentType,
    };

    const result = await this.s3.upload(params).promise();

    return result.Location; 
  }
}
