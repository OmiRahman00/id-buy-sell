import { Injectable, NotFoundException, BadRequestException, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dtos/create-post.dto';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { UserService } from 'src/user/user.service';
import { Tag } from 'src/tags/tag.entity';
import { TagsService } from 'src/tags/tags.service';
import { PatchPostDto } from './dtos/patch-post.dto';
import { GetPostsDto } from './dtos/get-post.dto';
import { PaginationService } from 'src/common/pagination/pagination.service';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';
import { CreatePostProvider } from './providers/create-post.provider';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

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


        /**
     * Injecting PaginationService into PostService
     * */
        private readonly paginationService: PaginationService,


        /**
     * Injecting CreatePostProvider into PostService
     * */

        private readonly createPostProvider: CreatePostProvider,
         
    ) {}

    public async create( @Body() createPostDto: CreatePostDto, user: ActiveUserData) {
        return await this.createPostProvider.create(createPostDto, user);
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

    public async findPostByUserId(postQuery: GetPostsDto, userId: number) : Promise<Paginated<Post>> {
        try {
            const queryBuilder = this.postRepository.createQueryBuilder('post')
                .leftJoinAndSelect('post.metaOption', 'metaOption')
                .leftJoinAndSelect('post.author', 'author')
                .leftJoinAndSelect('post.tags', 'tags')
                .where('author.id = :userId', { userId });
            
            // Use the pagination service
            const posts = await this.paginationService.paginateQuery(postQuery, this.postRepository);
            
            if (!posts || posts.data.length === 0) {
                throw new NotFoundException(`No posts found for user with ID ${userId}`);
            }
            
            return posts;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(`Failed to retrieve posts: ${error.message}`);
        }
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
