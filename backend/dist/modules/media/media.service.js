"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const media_entity_1 = require("./media.entity");
const path_1 = require("path");
const promises_1 = require("fs/promises");
let MediaService = class MediaService {
    constructor(mediaRepo) {
        this.mediaRepo = mediaRepo;
    }
    findAll() {
        return this.mediaRepo.find({ order: { createdAt: 'DESC' } });
    }
    async create(dto, file) {
        var _a;
        if (!file) {
            throw new common_1.BadRequestException('Image file is required');
        }
        const urlPath = `/uploads/media/${file.filename}`;
        const filePath = (0, path_1.relative)(process.cwd(), file.path);
        const media = this.mediaRepo.create({
            title: ((_a = dto.title) === null || _a === void 0 ? void 0 : _a.trim()) || file.originalname,
            fileName: file.filename,
            filePath,
            url: urlPath,
            mimeType: file.mimetype,
            size: file.size
        });
        return this.mediaRepo.save(media);
    }
    async remove(id) {
        const media = await this.mediaRepo.findOne({ where: { id } });
        if (!media) {
            throw new common_1.NotFoundException('Media not found');
        }
        await this.mediaRepo.remove(media);
        if (media.filePath) {
            const absPath = (0, path_1.join)(process.cwd(), media.filePath);
            try {
                await (0, promises_1.unlink)(absPath);
            }
            catch (_a) {
            }
        }
        return { id };
    }
};
exports.MediaService = MediaService;
exports.MediaService = MediaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(media_entity_1.Media)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MediaService);
//# sourceMappingURL=media.service.js.map