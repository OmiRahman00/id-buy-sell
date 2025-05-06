import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('post')
export class PostController {
    constructor(
        private readonly postService: PostService,
    ) {}


    /*
   * GET localhost:3000/posts/:userId
   */
    @Get()
    public getPost(
        @Param('/:userId') userId: string,
    ){
        return this.postService.findAllById(userId);    
    }

    @ApiOperation({
        summary: 'Creates a new blog post',
      })
      @ApiResponse({
        status: 201,
        description: 'You get a 201 response if your post is created successfully',
      })
    @Post('create')
    public create(
        @Body() createPostDto: CreatePostDto,
    ){
        return this.postService.create(createPostDto);
    }


    @ApiOperation({
        summary: 'Fetches a post by id',
      })
      @ApiResponse({
        status: 200,
        description: 'Post fetched successfully',
      })
    @Get('post/:id')
    public getPostById(
        @Param('id', ParseIntPipe) id: number,
    ){
        return this.postService.findPostById(id);
    }


    /*
   * GET a post by user ID
   */
    @Get('user/:userId')
    public getPostByUserId(
        @Param('userId', ParseIntPipe) userId: number,
    ){
        return this.postService.findPostByUserId(userId);
    }

    /**
   * Route to delete a post
   */
  @Delete('delete/:id')
  public deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postService.delete(id);
  }
}
