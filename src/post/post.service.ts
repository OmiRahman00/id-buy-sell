import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dtos/create-post.dto';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PostService {
    constructor(

        private readonly userService: UserService,

        /**
     * Injecting MetaOption repository into PostService
     * */
        @InjectRepository(MetaOption)
        private metaOptionRepository: Repository<MetaOption>,

        /**
     * Injecting Post repository into PostService
     * */
        @InjectRepository(Post)
        private postRepository: Repository<Post>,
    ) {}

    public async create(createPostDto: CreatePostDto) {
        // Create the metaOptions first if they exist
        // Transform metaOptions to match the expected type
        const transformedDto = {
            ...createPostDto,
            metaOptions: createPostDto.metaOptions
                ? { ...createPostDto.metaOptions }
                : undefined,
        };

        let post = this.postRepository.create(transformedDto);
    
        return await this.postRepository.save(post);
      }
    
}
