import { Module } from '@nestjs/common';
import { MetaOptionsService } from './meta-options.service';
import { MetaOptionsController } from './meta-options.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetaOption } from './meta-option.entity';

@Module({
  imports:[TypeOrmModule.forFeature([MetaOption])],
  providers: [MetaOptionsService],
  controllers: [MetaOptionsController],
  exports: [MetaOptionsService],
})
export class MetaOptionsModule {}
