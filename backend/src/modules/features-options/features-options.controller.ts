import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { FeaturesOptionsService } from './features-options.service';
import { CreateFeatureOptionDto } from './dto/create-feature-option.dto';
import { UpdateFeatureOptionDto } from './dto/update-feature-option.dto';

@Controller('features-options')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class FeaturesOptionsController {
  constructor(private readonly featuresOptionsService: FeaturesOptionsService) {}

  @Get()
  @Roles('admin')
  @Permissions('features_options.read')
  findAll() {
    return this.featuresOptionsService.findAll();
  }

  @Get(':id')
  @Roles('admin')
  @Permissions('features_options.read')
  findOne(@Param('id') id: string) {
    return this.featuresOptionsService.findOne(id);
  }

  @Post()
  @Roles('admin')
  @Permissions('features_options.create')
  create(@Body() dto: CreateFeatureOptionDto) {
    return this.featuresOptionsService.create(dto);
  }

  @Patch(':id')
  @Roles('admin')
  @Permissions('features_options.update')
  update(@Param('id') id: string, @Body() dto: UpdateFeatureOptionDto) {
    return this.featuresOptionsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  @Permissions('features_options.delete')
  remove(@Param('id') id: string) {
    return this.featuresOptionsService.remove(id);
  }
}
