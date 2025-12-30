import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';

export class CategoryOrderDto {
  @IsString()
  id!: string;

  @IsOptional()
  @IsUUID()
  parentId?: string | null;

  @IsNumber()
  position!: number;
}

export class ReorderCategoriesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryOrderDto)
  items!: CategoryOrderDto[];
}
