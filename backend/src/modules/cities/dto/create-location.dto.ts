import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  name!: string;

  @IsString()
  code!: string;

  @IsOptional()
  @IsUUID()
  cityId?: string;
}
