import { Body, Controller, Post } from '@nestjs/common';
import { CreatePostMetaOptionsDto } from './dtos/create-post-meta-options.dto';
import { MetaOptionsService } from './meta-options.service';

@Controller('meta-options')
export class MetaOptionsController {
    constructor(
        private readonly metaOptionsService: MetaOptionsService,
    ) {}

    @Post('create')
    public create(
        @Body() createMetaOptionDto: CreatePostMetaOptionsDto,
    ){
        return this.metaOptionsService.create(createMetaOptionDto);
    }
}
