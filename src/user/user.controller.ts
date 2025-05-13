import {
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Put,
    Query,
    Body,
    Headers,
    Ip,
    ParseIntPipe,
    DefaultValuePipe,
    ValidationPipe,
    UseGuards,
    SetMetadata,
  } from '@nestjs/common';
  import { ApiTags, ApiQuery, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { GetUsersParamDto } from './dtos/get-users-param.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { CreateManyUsersDto } from './dtos/create-many-users.dto';
import { AccessTokenGuard } from 'src/auth/gaurds/access-token/access-token.guard';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';

@Controller('user')
@ApiTags('User')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) {}

    @Get('all')
    @ApiOperation({
        summary: 'Fetches a list of registered users on the application',
      })
      @ApiResponse({
        status: 200,
        description: 'Users fetched successfully based on the query',
      })
      @ApiQuery({
        name: 'limit',
        type: 'number',
        required: false,
        description: 'The number of entries returned per query',
        example: 10,
      })
      @ApiQuery({
        name: 'page',
        type: 'number',
        required: false,
        description:
          'The position of the page number that you want the API to return',
        example: 1,
      })
    public getUsers(
    @Param() getUserParamDto: GetUsersParamDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    ){
        return this.userService.findAll(getUserParamDto, limit, page);
    }


    @Get('/:id')
    @ApiOperation({
        summary: 'Fetches a user by id',
      })
      @ApiResponse({
        status: 200,
        description: 'User fetched successfully',
      })
    public getUser(
        @Param('id') id: number,
    ){
        return this.userService.findOne(id);
    }
    
    @Post('create')
    @Auth(AuthType.None)
    @ApiOperation({
        summary: 'Create a new user',
      })
      @ApiResponse({
        status: 200,
        description: 'User created successfully',
      })
    public createUser(
        @Body() createUserDto: CreateUserDto,
    ){
        return this.userService.createUser(createUserDto);
    }

    @Patch('update/:id')
    @ApiOperation({
        summary: 'Update a user',
      })
      @ApiResponse({
        status: 200,
        description: 'User updated successfully',
      })
    public updateUser(
        @Param('id') id: number,
        @Body() updateUserDto: CreateUserDto,
    ){
        return this.userService.update(id, updateUserDto);
    }

    @Post('create-many')
  public createManyUsers(@Body() createManyUsersDto: CreateManyUsersDto) {
    return this.userService.createMany(createManyUsersDto);
  } 
    
}
