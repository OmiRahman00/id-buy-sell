import { BadRequestException, ClassSerializerInterceptor, Inject, Injectable, RequestTimeoutException, UseInterceptors } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersParamDto } from './dtos/get-users-param.dto';
import { ConfigType } from '@nestjs/config';
import profileConfig from './config/profile.config';
import { UserCreateManyService } from './user-create-many.service';
import { CreateManyUsersDto } from './dtos/create-many-users.dto';
import { CreateUserProvider } from './providers/create-user.provider';
import { FindOneUserByEmailProvider } from './providers/find-one-user-by-email.provider';
import { FindOneBtGoogleIdProvider } from './providers/find-one-bt-google-id.provider';
import { CreateGoogleUserProvider } from './providers/create-google-user.provider';
import { GoogleUser } from './interfaces/google-user.inerface';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';

@Injectable()
export class UserService {
    constructor(
        /**
     * Injecting User repository into UsersService
     * */
        @InjectRepository(User)
        private userRepository: Repository<User>,


     
        private readonly userCreateManyService: UserCreateManyService,
        /**
     * Injecting ProfileConfig into UsersService
     */
        @Inject(profileConfig.KEY)
        private readonly profileConfiguration: ConfigType<typeof profileConfig>,

        /**
     * Injecting CreateUserProvider into UsersService
     */
        private readonly createUserProvider: CreateUserProvider,


    
        /**
     * Injecting FindOneUserByEmailProvider into UsersService
    */
        private readonly findOneUserByEmailProvider: FindOneUserByEmailProvider,
         /**
     * Injecting FindOneBtGoogleIdProvider into UsersService
     */
        private readonly findOneBtGoogleIdProvider: FindOneBtGoogleIdProvider,

        /**
     * Injecting CreateGoogleUserProvider into UsersService
     */
        private readonly createGoogleUserProvider: CreateGoogleUserProvider,

    ) {}
    
    // @UseInterceptors(ClassSerializerInterceptor) //exclude any property from the response
    public async createUser(createUserDto: CreateUserDto){
        return await this.createUserProvider.createUser(createUserDto);
    }


    /**
     * @param getUsersParamDto
     * @param limit
     * @param offset
     * find all users
     */
    public async findAll(
        getUsersParamDto: GetUsersParamDto,
        limit: number,
        offset: number,
    ) {
        console.log(this.profileConfiguration);
        console.log(this.profileConfiguration.apiKey); 
        return await this.userRepository.find();
    }

    /**
     * @param id
     * find user by id
     */

    public async findOne(id: number) {

        try {
            
            return await this.userRepository.findOne({
                where: {
                    id,
                },
            });
        } catch (error) {
            throw new RequestTimeoutException(
                'Unable to process your request at the moment please try later',
                {
                  description: 'Error connecting to database',
                },
              );
        }
        
    }

    /**
     * @param id
     * update user by id
     */
    
    public async update (id: number, updateUserDto: CreateUserDto) {
        const user = await this.userRepository.findOne({
            where: {
                id,
            },
        });
        if (!user) {
            throw new Error('User not found');
        }
        const updatedUser = Object.assign(user, updateUserDto);
        return await this.userRepository.save(updatedUser);
    }

    /**
     * @param id
     * delete user by id
     */
    public async remove(id: number) {
        const user = await this.userRepository.findOne({
            where: {
                id,
            },
        });
        if (!user) {
            throw new Error('User not found');
        }
        return await this.userRepository.remove(user);
    }

    public async createMany(createManyUsersDto: CreateManyUsersDto) {
        return await this.userCreateManyService.createMany(createManyUsersDto);
    }

    public async findOneByEmail(email: string) {
        return await this.findOneUserByEmailProvider.findOneByEmail(email);
    }

    public async findOneByGoogleId(googleId: string) {
        return await this.findOneBtGoogleIdProvider.findOneByGoogleId(googleId);
    }


    public async createGoogleUser(googleUser: GoogleUser) {
        return await this.createGoogleUserProvider.createGoogleUser(googleUser);
    }

}
