import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media } from './media.entity';
import { CreateMediaDto } from './dto/create-media.dto';
import { join, relative } from 'path';
import { unlink } from 'fs/promises';

export interface UploadedMediaFile {
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  path: string;
}

@Injectable()
export class MediaService {
  constructor(@InjectRepository(Media) private readonly mediaRepo: Repository<Media>) {}

  findAll() {
    return this.mediaRepo.find({ order: { createdAt: 'DESC' } });
  }

  async create(dto: CreateMediaDto, file?: UploadedMediaFile) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    const urlPath = `/uploads/media/${file.filename}`;
    const filePath = relative(process.cwd(), file.path);

    const media = this.mediaRepo.create({
      title: dto.title?.trim() || file.originalname,
      fileName: file.filename,
      filePath,
      url: urlPath,
      mimeType: file.mimetype,
      size: file.size
    });
    return this.mediaRepo.save(media);
  }

  async remove(id: string) {
    const media = await this.mediaRepo.findOne({ where: { id } });
    if (!media) {
      throw new NotFoundException('Media not found');
    }

    await this.mediaRepo.remove(media);

    if (media.filePath) {
      const absPath = join(process.cwd(), media.filePath);
      try {
        await unlink(absPath);
      } catch {
        // ignore missing files
      }
    }

    return { id };
  }
}
