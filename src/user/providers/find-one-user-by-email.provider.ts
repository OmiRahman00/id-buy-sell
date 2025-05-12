import { Injectable, RequestTimeoutException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';

@Injectable()
export class FindOneUserByEmailProvider {
    constructor(
        /** inject the userRepository
         */
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ){}

    public async findOneByEmail(email: string){
        let user: User | null = null;
        try {
            user = await this.userRepository.findOneBy({
                email: email,
            })
        } catch (error) {
            throw new RequestTimeoutException(error, {
                description: 'Could not fetch user',
            })
        }

        if (!user) {
            throw new UnauthorizedException('User does not exist');
        }

        return user;
    }
}
