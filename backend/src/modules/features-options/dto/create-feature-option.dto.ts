import { IsIn, IsOptional, IsString } from 'class-validator';

export class CreateFeatureOptionDto {
  @IsString()
  text!: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  @IsIn(['active', 'inactive'])
  status?: 'active' | 'inactive';
}
