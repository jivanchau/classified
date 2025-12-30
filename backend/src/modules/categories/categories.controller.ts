import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ReorderCategoriesDto } from './dto/reorder-categories.dto';

@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @Roles('admin')
  @Permissions('categories.read')
  findAll() {
    return this.categoriesService.findAllTree();
  }

  @Get(':id')
  @Roles('admin')
  @Permissions('categories.read')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOneTree(id);
  }

  @Post()
  @Roles('admin')
  @Permissions('categories.create')
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Patch('reorder')
  @Roles('admin')
  @Permissions('categories.reorder')
  reorder(@Body() dto: ReorderCategoriesDto) {
    return this.categoriesService.reorder(dto.items);
  }

  @Patch(':id')
  @Roles('admin')
  @Permissions('categories.update')
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  @Permissions('categories.delete')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
