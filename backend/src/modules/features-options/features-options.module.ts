import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeatureOption } from './feature-option.entity';
import { FeaturesOptionsController } from './features-options.controller';
import { FeaturesOptionsService } from './features-options.service';

@Module({
  imports: [TypeOrmModule.forFeature([FeatureOption])],
  controllers: [FeaturesOptionsController],
  providers: [FeaturesOptionsService]
})
export class FeaturesOptionsModule {}
