import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Controller('cities')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get()
  @Roles('admin')
  @Permissions('cities.read')
  findAll() {
    return this.citiesService.findAll();
  }

  @Get(':id')
  @Roles('admin')
  @Permissions('cities.read')
  findOne(@Param('id') id: string) {
    return this.citiesService.findOne(id);
  }

  @Post()
  @Roles('admin')
  @Permissions('cities.create')
  createCity(@Body() dto: CreateCityDto) {
    return this.citiesService.createCity(dto);
  }

  @Patch(':id')
  @Roles('admin')
  @Permissions('cities.update')
  updateCity(@Param('id') id: string, @Body() dto: UpdateCityDto) {
    return this.citiesService.updateCity(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  @Permissions('cities.delete')
  removeCity(@Param('id') id: string) {
    return this.citiesService.removeCity(id);
  }

  @Get(':cityId/locations')
  @Roles('admin')
  @Permissions('locations.read')
  findLocations(@Param('cityId') cityId: string) {
    return this.citiesService.findLocations(cityId);
  }

  @Post(':cityId/locations')
  @Roles('admin')
  @Permissions('locations.create')
  createLocation(@Param('cityId') cityId: string, @Body() dto: CreateLocationDto) {
    return this.citiesService.createLocation(cityId, dto);
  }

  @Patch(':cityId/locations/:locationId')
  @Roles('admin')
  @Permissions('locations.update')
  updateLocation(
    @Param('cityId') cityId: string,
    @Param('locationId') locationId: string,
    @Body() dto: UpdateLocationDto
  ) {
    return this.citiesService.updateLocation(cityId, locationId, dto);
  }

  @Delete(':cityId/locations/:locationId')
  @Roles('admin')
  @Permissions('locations.delete')
  removeLocation(@Param('cityId') cityId: string, @Param('locationId') locationId: string) {
    return this.citiesService.removeLocation(cityId, locationId);
  }
}
