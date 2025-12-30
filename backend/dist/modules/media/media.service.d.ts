import { Repository } from 'typeorm';
import { Media } from './media.entity';
import { CreateMediaDto } from './dto/create-media.dto';
export interface UploadedMediaFile {
    filename: string;
    originalname: string;
    mimetype: string;
    size: number;
    path: string;
}
export declare class MediaService {
    private readonly mediaRepo;
    constructor(mediaRepo: Repository<Media>);
    findAll(): Promise<Media[]>;
    create(dto: CreateMediaDto, file?: UploadedMediaFile): Promise<Media>;
    remove(id: string): Promise<{
        id: string;
    }>;
}
