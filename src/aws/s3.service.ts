import { Injectable } from '@nestjs/common';
import { S3Client, HeadBucketCommand, CreateBucketCommand, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class S3Service {
  private s3: S3Client;
  private bucketName: string = "my-bucket";  

  constructor() {
    this.s3 = new S3Client({
      endpoint: "http://localstack:4566",  
      region: "us-east-1",  
      credentials: {
        accessKeyId: "test",  
        secretAccessKey: "test", 
      },
      forcePathStyle: true,
    });
  }

  async createBucketIfNotExists(): Promise<void> {
    try {
      await this.s3.send(new HeadBucketCommand({ Bucket: this.bucketName }));
    } catch (error) {
      if (error.name === 'NotFound') {
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
    return `http://localhost:4566/${this.bucketName}/${fileName}`;  
  }
}