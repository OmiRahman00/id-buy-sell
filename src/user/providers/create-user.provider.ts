import { BadRequestException, forwardRef, Inject, Injectable, RequestTimeoutException } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { HasingProvider } from 'src/auth/providers/hasing.provider';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CreateUserProvider {
    constructor(
        /** inject the userRepository
         */
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
 
        /**
         * Injecting HasingProvider into CreateUserProvider
         */
        @Inject(forwardRef(() => HasingProvider))
        private readonly hasingProvider: HasingProvider,
    ){}



    public async createUser(createUserDto: CreateUserDto){
    
            /**
             * Check if the user already exist or not
             */
    
            let existingUser= undefined;
            try{
                //@ts-ignore
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
            
            let newUser = this.userRepository.create({
                ...createUserDto,
                password: await this.hasingProvider.hashPassword(createUserDto.password),
            });
            try {
                
                newUser = await this.userRepository.save(newUser);
            } catch (error) {
                throw new RequestTimeoutException(
                    'Unable to process your request at the moment please try later',
                    {
                      description: 'Error connecting to database',
                    },
                  );
            }
            return newUser;
           
        }
}
