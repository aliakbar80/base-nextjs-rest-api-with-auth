import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Uploads } from './uploads.entity';
import { CreateUploadDto } from './uploads.dto';

@Injectable()
export class UploadsService {
  constructor(
    @InjectRepository(Uploads)
    private uploadsRepository: Repository<Uploads>,
  ) {}

  async create(createUploadDto: CreateUploadDto): Promise<Uploads> {
    const upload = this.uploadsRepository.create(createUploadDto);
    return this.uploadsRepository.save(upload);
  }

  async findOne(id: number, userId: number): Promise<Uploads | undefined> {
    if (!id) {
      throw new NotFoundException('شناسه فایل باید وارد شود');
    }
    if (!userId) {
      throw new NotFoundException('کاربری باید وارد شود');
    }
    return this.uploadsRepository.findOne({
      where: { id, userId },
    });
  }

  async findByType(type: string, userId: number): Promise<Uploads[] | undefined> {
    if (!type) {
      throw new NotFoundException('نوع فایل باید وارد شود');
    }
    if (!userId) {
      throw new NotFoundException('کاربری باید وارد شود');
    }
    return this.uploadsRepository.find({
      where: { type, userId },
    });
  }

  async findAll(userId: number): Promise<Uploads[]> {
    if (!userId) {
      throw new NotFoundException('کاربری باید وارد شود');
    }
    return this.uploadsRepository.find({
      where: { userId },
    });
  }

  async seachQueryFile(
    name: string,
    userId: number,
  ): Promise<Uploads[] | undefined> {
    if (!userId) {
      throw new NotFoundException('کاربری باید وارد شود');
    }
    if (!name) {
      throw new NotFoundException('نام فایل باید وارد شود');
    }
    return this.uploadsRepository
      .createQueryBuilder('uploads')
      .where('uploads.name LIKE :name', { name: `%${name}%` })
      .andWhere('uploads.userId = :userId', { userId })
      .select([
        "uploads.id as id",
        "uploads.url as url",
        "uploads.name as name",
        "uploads.type as type",
        "uploads.size as size",
        "uploads.destination as destination",
        "uploads.createdAt as createdAt",
        "uploads.userId as userId",
      ])
      .getRawMany();
  }

  async remove(id: number, userId: number): Promise<void> {
    if (this.findOne(id, userId) === undefined) {
      throw new NotFoundException('پیدا نشد');
    }

    await this.uploadsRepository.delete({ id, userId });
  }
}
