import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './tag.entity';
import { In, Repository } from 'typeorm';
import { CreateTagDto } from './dtos/create-tag.dto';

@Injectable()
export class TagsService {
    constructor(
         /**
     * Inject tagsRepository
     */
        @InjectRepository(Tag)
        private readonly tagsRepository: Repository<Tag>,
    ){}

    public async create(createTagDto: CreateTagDto) {
        let tag = this.tagsRepository.create(createTagDto);
        return await this.tagsRepository.save(tag);
    }

    public async findMultipleTags(tags: number[]){
        let tag = await this.tagsRepository.find({
            where:{
                id : In(tags)
            }
        })
        
        return tag
    }

    public async delete(id: number) {
        await this.tagsRepository.delete(id);
    
        return {
          deleted: true,
          id,
        };
      }
}
