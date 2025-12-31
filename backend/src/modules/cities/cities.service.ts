import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from './city.entity';
import { Location } from './location.entity';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

export interface LocationResponse {
  id: string;
  cityId: string;
  name: string;
  code: string;
}

export interface CityResponse {
  id: string;
  name: string;
  code: string;
  locations: LocationResponse[];
}

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City) private readonly citiesRepo: Repository<City>,
    @InjectRepository(Location) private readonly locationsRepo: Repository<Location>
  ) {}

  async findAll(): Promise<CityResponse[]> {
    const cities = await this.citiesRepo.find({
      relations: ['locations'],
      order: { name: 'ASC', code: 'ASC', locations: { name: 'ASC', code: 'ASC' } }
    });
    return cities.map(city => this.toCityResponse(city));
  }

  async findOne(id: string): Promise<CityResponse> {
    const city = await this.findCityEntity(id);
    return this.toCityResponse(city);
  }

  async createCity(dto: CreateCityDto): Promise<CityResponse> {
    const city = this.citiesRepo.create({ name: dto.name, code: dto.code });
    const saved = await this.citiesRepo.save(city);
    return this.findOne(saved.id);
  }

  async updateCity(id: string, dto: UpdateCityDto): Promise<CityResponse> {
    const city = await this.findCityEntity(id, false);

    if (dto.name !== undefined) city.name = dto.name;
    if (dto.code !== undefined) city.code = dto.code;

    await this.citiesRepo.save(city);
    return this.findOne(id);
  }

  async removeCity(id: string) {
    const city = await this.findCityEntity(id, false);
    await this.citiesRepo.remove(city);
    return { id };
  }

  async findLocations(cityId: string): Promise<LocationResponse[]> {
    await this.findCityEntity(cityId, false);
    const locations = await this.locationsRepo.find({
      where: { city: { id: cityId } },
      relations: ['city'],
      order: { name: 'ASC', code: 'ASC' }
    });
    return locations.map(location => this.toLocationResponse(location, cityId));
  }

  async createLocation(cityId: string, dto: CreateLocationDto): Promise<LocationResponse> {
    const city = await this.findCityEntity(dto.cityId ?? cityId, false);
    const location = this.locationsRepo.create({
      name: dto.name,
      code: dto.code,
      city
    });
    const saved = await this.locationsRepo.save(location);
    return this.toLocationResponse(saved, city.id);
  }

  async updateLocation(cityId: string, locationId: string, dto: UpdateLocationDto): Promise<LocationResponse> {
    const location = await this.findLocationEntity(locationId);

    if (location.cityId !== cityId && !dto.cityId) {
      throw new NotFoundException('Location not found in this city');
    }

    if (dto.cityId) {
      const city = await this.findCityEntity(dto.cityId, false);
      location.city = city;
    }

    if (dto.name !== undefined) location.name = dto.name;
    if (dto.code !== undefined) location.code = dto.code;

    const saved = await this.locationsRepo.save(location);
    const targetCityId = dto.cityId ?? location.cityId ?? cityId;
    return this.toLocationResponse(saved, targetCityId);
  }

  async removeLocation(cityId: string, locationId: string) {
    const location = await this.findLocationEntity(locationId);
    if (location.cityId !== cityId) {
      throw new NotFoundException('Location not found in this city');
    }
    await this.locationsRepo.remove(location);
    return { id: locationId };
  }

  private toCityResponse(city: City): CityResponse {
    const locations = [...(city.locations || [])]
      .sort((a, b) => a.name.localeCompare(b.name) || a.code.localeCompare(b.code))
      .map(location => this.toLocationResponse(location, city.id));
    return {
      id: city.id,
      name: city.name,
      code: city.code,
      locations
    };
  }

  private toLocationResponse(location: Location, fallbackCityId?: string): LocationResponse {
    return {
      id: location.id,
      cityId: location.cityId || location.city?.id || fallbackCityId || '',
      name: location.name,
      code: location.code
    };
  }

  private async findCityEntity(id: string, withRelations = true) {
    const city = await this.citiesRepo.findOne({ where: { id }, relations: withRelations ? ['locations'] : [] });
    if (!city) throw new NotFoundException('City not found');
    return city;
  }

  private async findLocationEntity(id: string) {
    const location = await this.locationsRepo.findOne({ where: { id }, relations: ['city'] });
    if (!location) throw new NotFoundException('Location not found');
    return location;
  }
}
