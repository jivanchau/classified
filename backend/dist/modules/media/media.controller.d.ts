import { MediaService, UploadedMediaFile } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
export declare class MediaController {
    private readonly mediaService;
    constructor(mediaService: MediaService);
    findAll(): Promise<import("./media.entity").Media[]>;
    create(dto: CreateMediaDto, file?: UploadedMediaFile): Promise<import("./media.entity").Media>;
    remove(id: string): Promise<{
        id: string;
    }>;
}
