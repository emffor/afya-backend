import { Injectable } from '@nestjs/common';
import { S3Client, HeadBucketCommand, CreateBucketCommand, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class S3Service {
  private s3: S3Client;
  private bucketName: string = process.env.S3_BUCKET || 'my-bucket';

  constructor() {
    this.s3 = new S3Client({
      endpoint: process.env.S3_ENDPOINT || 'http://localstack:4566',
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test',
      },
      forcePathStyle: true,
    });
  }

  async createBucketIfNotExists(): Promise<void> {
    try {
      await this.s3.send(new HeadBucketCommand({ Bucket: this.bucketName }));
    } catch (error: any) {
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        await this.s3.send(new CreateBucketCommand({ Bucket: this.bucketName }));
      }
    }
  }

  async uploadFile(fileBuffer: Buffer, fileName: string, contentType: string): Promise<string> {
    await this.createBucketIfNotExists();

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
      Body: fileBuffer,
      ContentType: contentType,
    });

    await this.s3.send(command);

    return `${process.env.S3_ENDPOINT || 'http://localstack:4566'}/${this.bucketName}/${fileName}`;
  }
}
