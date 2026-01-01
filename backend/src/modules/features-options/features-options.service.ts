import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeatureOption } from './feature-option.entity';
import { CreateFeatureOptionDto } from './dto/create-feature-option.dto';
import { UpdateFeatureOptionDto } from './dto/update-feature-option.dto';

export interface FeatureOptionResponse {
  id: string;
  text: string;
  icon: string | null;
  status: 'active' | 'inactive';
}

@Injectable()
export class FeaturesOptionsService {
  constructor(@InjectRepository(FeatureOption) private readonly featureOptionsRepo: Repository<FeatureOption>) {}

  async findAll(): Promise<FeatureOptionResponse[]> {
    const options = await this.featureOptionsRepo.find({ order: { text: 'ASC' } });
    return options.map(option => this.toResponse(option));
  }

  async findOne(id: string): Promise<FeatureOptionResponse> {
    const option = await this.featureOptionsRepo.findOne({ where: { id } });
    if (!option) {
      throw new NotFoundException('Feature option not found');
    }
    return this.toResponse(option);
  }

  async create(dto: CreateFeatureOptionDto): Promise<FeatureOptionResponse> {
    const entity = this.featureOptionsRepo.create({
      text: dto.text,
      icon: dto.icon,
      status: dto.status || 'active'
    });
    const saved = await this.featureOptionsRepo.save(entity);
    return this.toResponse(saved);
  }

  async update(id: string, dto: UpdateFeatureOptionDto): Promise<FeatureOptionResponse> {
    const option = await this.featureOptionsRepo.findOne({ where: { id } });
    if (!option) {
      throw new NotFoundException('Feature option not found');
    }

    if (dto.text !== undefined) option.text = dto.text;
    if (dto.icon !== undefined) option.icon = dto.icon;
    if (dto.status !== undefined) option.status = dto.status;

    const saved = await this.featureOptionsRepo.save(option);
    return this.toResponse(saved);
  }

  async remove(id: string) {
    const option = await this.featureOptionsRepo.findOne({ where: { id } });
    if (!option) {
      throw new NotFoundException('Feature option not found');
    }
    await this.featureOptionsRepo.remove(option);
    return { id };
  }

  private toResponse(option: FeatureOption): FeatureOptionResponse {
    return {
      id: option.id,
      text: option.text,
      icon: option.icon ?? null,
      status: (option.status as 'active' | 'inactive') || 'active'
    };
  }
}
