import { BadRequestException, Body, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UserService } from 'src/user/user.service';
import { TagsService } from 'src/tags/tags.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { Tag } from 'src/tags/tag.entity';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Injectable()
export class CreatePostProvider {

    constructor(
        private readonly userService: UserService,
        private readonly tagsService : TagsService,
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
    ){}

    public async create(@Body() createPostDto: CreatePostDto, user: ActiveUserData) {
            
        let author, tags;
        try{
         author = await this.userService.findOne(user.sub)
         tags = await this.tagsService.findMultipleTags(createPostDto.tags || []);
        
        }catch(error){
            throw new ConflictException(error)
        }
        
        if(createPostDto.tags?.length !== tags.length){
            throw new BadRequestException('One or more tags could not be found');
        }

        let post = this.postRepository.create({
            ...createPostDto,
            author: author,
            tags: tags,
            metaOption: createPostDto.metaOption 
                ? { ...createPostDto.metaOption } 
                : undefined,
        });

        try {
            
        } catch (error) {
            throw new ConflictException(error,{
                description: "Ensure slugs are unique"
            })
        }
        return await this.postRepository.save(post);
    }
}
