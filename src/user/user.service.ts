import { BadRequestException, Inject, Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersParamDto } from './dtos/get-users-param.dto';
import { ConfigType } from '@nestjs/config';
import profileConfig from './config/profile.config';

@Injectable()
export class UserService {
    constructor(
        /**
     * Injecting User repository into UsersService
     * */
        @InjectRepository(User)
        private userRepository: Repository<User>,


        /**
     * Injecting ProfileConfig into UsersService
     */
        @Inject(profileConfig.KEY)
        private readonly profileConfiguration: ConfigType<typeof profileConfig>,
    ) {}
    
    public async createUser(createUserDto: CreateUserDto){

        /**
         * Check if the user already exist or not
         */

        let existingUser= undefined;
        try{
            
            existingUser = await this.userRepository.findOne({
               where: {
                   email: createUserDto.email,
               },
           });
        }catch(error){
            throw new RequestTimeoutException(
                'Unable to process your request at the moment please try later',
                {
                  description: 'Error connecting to database',
                },
              );
        }

        if (existingUser) {
            throw new BadRequestException(
              'The user already exists, please check your email',
            );
          }
        
        let newUser = this.userRepository.create(createUserDto);
        newUser = await this.userRepository.save(newUser);
        return newUser;
       
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
        const user = await this.userRepository.findOne({
            where: {
                id,
            },
        });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
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

}
