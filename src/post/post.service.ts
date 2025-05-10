import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
        try {
            //find user exist or not first
            let author = await this.userService.findOne(createPostDto.authorId)
            if (!author) {
                throw new NotFoundException(`Author with ID ${createPostDto.authorId} not found`);
            }
            
            //find the tags first
            let tags: Tag[] = [];
            if (createPostDto.tags && createPostDto.tags.length > 0) {
                tags = await this.tagsService.findMultipleTags(createPostDto.tags);
                // Verify all tags were found
                if (tags.length !== createPostDto.tags.length) {
                    throw new BadRequestException('One or more tags could not be found');
                }
            }
            
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
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException('Failed to create post: ' + error.message);
        }
    }

    public async findAllById(userId: string) {
        try {
            // const user = this.userService.findOne(userId);

            /**
             * Get all posts by user id with metaOptions when the eager not true in the post.entity.ts
             * */

            let posts = await this.postRepository.find({
                relations: {
                    metaOption: true,
                    author: true,
                    tags: true
                }
            });
            
            if (!posts || posts.length === 0) {
                throw new NotFoundException(`No posts found`);
            }
            
            return posts;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(`Failed to retrieve posts: ${error.message}`);
        }
    }


    public async findPostById(id: number) {
        try {
            let post = await this.postRepository.find({
                where: {
                    id,
                },
                relations: {
                    metaOption: true,
                    author: true,
                    tags: true,
                },
            });
            
            if (!post || post.length === 0) {
                throw new NotFoundException(`Post with ID ${id} not found`);
            }
            
            return post;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(`Failed to retrieve post: ${error.message}`);
        }
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

        /**
         * If tags were not found
         * Need to be equal number of tags
         */
        if (!tags || (patchPostDto.tags && tags.length !== patchPostDto.tags.length)) {
          throw new BadRequestException(
            'Please check your tag Ids and ensure they are correct',
          );
        }

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
        
        // Save the updated post
        const updatedPost = await this.postRepository.save(post);

        return updatedPost;
    }
    /**
     * implementing sequential delete
     */

    public async delete(id: number) {
        try {
            // Find the post first to check if it exists
            const post = await this.postRepository.findOneBy({ id });
            
            if (!post) {
                throw new NotFoundException(`Post with ID ${id} not found`);
            }
            
            // Delete the post
            await this.postRepository.delete(id);  
            
            return { deleted: true, id };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(`Failed to delete post: ${error.message}`);
        }
    }
    
    
}
