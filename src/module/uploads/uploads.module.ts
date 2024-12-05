import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Uploads } from './uploads.entity';
import { UploadsService } from './uploads.service';
import { UploadController } from './uploads.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Uploads])],
  controllers: [UploadController],
  providers: [UploadsService],
})
export class UploadModule {}
