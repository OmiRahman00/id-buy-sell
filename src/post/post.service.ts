import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dtos/create-post.dto';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { UserService } from 'src/user/user.service';
import { Tag } from 'src/tags/tag.entity';
import { TagsService } from 'src/tags/tags.service';
import { PatchPostDto } from './dtos/patch-post.dto';

@Injectable()
export class PostService {
    constructor(

        private readonly userService: UserService,
        private readonly tagsService : TagsService,

        /**
     * Injecting MetaOption repository into PostService
     * */
        @InjectRepository(MetaOption)
        private readonly metaOptionRepository: Repository<MetaOption>,

        /**
     * Injecting Post repository into PostService
     * */
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,

         
    ) {}

    public async create(createPostDto: CreatePostDto) {
        //find user exist or not first
        let author = await this.userService.findOne(createPostDto.authorId)
        //find the tags first
        let tags = createPostDto.tags 
            ? await this.tagsService.findMultipleTags(createPostDto.tags) 
            : [];
        // Save the post (and its meta option via cascade)
        let post = this.postRepository.create({
            ...createPostDto,
            author: author,
            tags: tags,
            metaOption: createPostDto.metaOption 
                ? { ...createPostDto.metaOption } 
                : undefined,
        });
        return await this.postRepository.save(post);
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
                    tags: true
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

        let post = await this.postRepository.find({
            where: {
                id,
            },
            relations: {
                metaOption: true,
                author: true,
                tags: true,
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
        // console.log(post);
        return post;
    }

    /**
     * 
     * update a post methods
     */

    public async updatePost(patchPostDto: PatchPostDto) {
        // Find new tags, if provided
        const tags = await this.tagsService.findMultipleTags(patchPostDto.tags || []);
    
        // Find the post by ID
        const post = await this.postRepository.findOneBy({ id: patchPostDto.id });
    
        // Check if post exists
        if (!post) {
            throw new NotFoundException(`Post with ID ${patchPostDto.id} not found`);
        }
    
        // Update post properties
        post.tags = tags;
        post.title = patchPostDto.title ?? post.title;
        post.postType = patchPostDto.postType ?? post.postType;
        post.slug = patchPostDto.slug ?? post.slug;
        post.status = patchPostDto.status ?? post.status;
        post.content = patchPostDto.content ?? post.content;
        post.schema = patchPostDto.schema ?? post.schema;
        post.featuredImageUrl = patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
        post.publishOn = patchPostDto.publishOn ? new Date(patchPostDto.publishOn) : post.publishOn;
        
        // Optionally update other fields from patchPostDto if needed
        // e.g., post.title = patchPostDto.title ?? post.title;
    
        // Save the updated post
        const updatedPost = await this.postRepository.save(post);
    
        return updatedPost;
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
