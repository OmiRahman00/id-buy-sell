import { Body, Controller, Delete, Param, ParseIntPipe, Post } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dtos/create-tag.dto';

@Controller('tags')
export class TagsController {
    constructor(

        /**
         * inject the service
         */
        private readonly tagService: TagsService,
    ){}

    /**
     * endpoint for the create tags
     */

    @Post('create')
    public create(@Body() CreateTagDto: CreateTagDto){
        return this.tagService.create(CreateTagDto)
    }

    @Delete('delete')
    public delete(@Param('id', ParseIntPipe) id: number,){
        return this.tagService.delete(id)
    }

}
