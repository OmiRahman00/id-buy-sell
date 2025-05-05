import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from './meta-option.entity';
import { Repository } from 'typeorm';
import { CreatePostMetaOptionsDto } from './dtos/create-post-meta-options.dto';

@Injectable()
export class MetaOptionsService {
    constructor(
        /**
     * Injecting MetaOption repository into MetaOptionsService
     * */
        @InjectRepository(MetaOption)
        private metaOptionRepository: Repository<MetaOption>,
    ) {}

    public async create(CreateMetaOption: CreatePostMetaOptionsDto) {
        let metaOption = this.metaOptionRepository.create(CreateMetaOption);
        metaOption = await this.metaOptionRepository.save(metaOption);
        return metaOption;
    }


}
