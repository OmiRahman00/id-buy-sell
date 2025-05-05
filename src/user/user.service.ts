import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersParamDto } from './dtos/get-users-param.dto';

@Injectable()
export class UserService {
    constructor(
        /**
     * Injecting User repository into UsersService
     * */
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}
    
    public async createUser(createUserDto: CreateUserDto){

        /**
         * Check if the user already exist or not
         */
        const existingUser = await this.userRepository.findOne({
            where: {
                email: createUserDto.email,
            },
        });
        if(existingUser){
            throw new Error('User already exists');
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
