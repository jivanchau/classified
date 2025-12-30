import { BadRequestException, Body, Controller, Delete, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { MediaService, UploadedMediaFile } from './media.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CreateMediaDto } from './dto/create-media.dto';

const uploadDir = join(process.cwd(), 'uploads', 'media');

const storage = diskStorage({
  destination: (_req, _file, cb) => {
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = extname(file.originalname) || '';
    cb(null, `${unique}${extension}`);
  }
});

@Controller('media')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  @Roles('admin')
  @Permissions('media.read')
  findAll() {
    return this.mediaService.findAll();
  }

  @Post()
  @Roles('admin')
  @Permissions('media.create')
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new BadRequestException('Only image uploads are allowed') as any, false);
        }
        cb(null, true);
      }
    })
  )
  create(@Body() dto: CreateMediaDto, @UploadedFile() file?: UploadedMediaFile) {
    return this.mediaService.create(dto, file);
  }

  @Delete(':id')
  @Roles('admin')
  @Permissions('media.delete')
  remove(@Param('id') id: string) {
    return this.mediaService.remove(id);
  }
}
