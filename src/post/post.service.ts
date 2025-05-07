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
        // Create a new post entity
        let post = this.postRepository.create({
            ...createPostDto,
            metaOption: createPostDto.metaOption 
                ? this.metaOptionRepository.create(createPostDto.metaOption)
                : undefined
        });
        
        let author = await this.userService.findOne(createPostDto.authorId)
        // Save the post (and its meta option via cascade)
        return await this.postRepository.save({
            ...post,
            author: author,
        });
    }

    public async findAllById(userId: string) {
        // const user = this.userService.findOne(userId);

        /**
         * Get all posts by user id with metaOptions when the eager not true in the post.entity.ts
         * */

        // let posts = await this.postRepository.find({
        //     relations: {
        //         metaOptions: true,
        //     }
        // })
        let posts = await this.postRepository.find(
            {
                relations:{
                    metaOption: true,
                    author: true,
                }
            }
        )
        return posts;
    }


    public async findPostById(id: number) {
        // let post = await this.postRepository.find({
        //     where: {
        //         id,
        //     },
        //     relations: {
        //         metaOption: true,
        //     },
        // })

        let post = await this.metaOptionRepository.find({
            where: {
                id,
            },
            relations: {
                post: true,
            },
        })
        return post;
    }


    /**
     * implementing find post by user id
     */

    public async findPostByUserId(userId: number) {
        console.log(userId)
        let post = await this.postRepository.find({
            where: {
                author: {
                    id: userId,
                },
            },
            relations: {
                metaOption: true,
                author: true,
            },
        })
        console.log(post);
        return post;
    }

    /**
     * implementing sequential delete
     */

    public async delete(id: number) {
        // find the post
        
        await this.postRepository.delete(id);  

        return {deleted: true, id}

    }
    
    
}
