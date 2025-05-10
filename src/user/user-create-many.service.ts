import { ConflictException, Injectable, RequestTimeoutException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './user.entity';
import { DataSource } from 'typeorm';
import { CreateManyUsersDto } from './dtos/create-many-users.dto';

@Injectable()
export class UserCreateManyService {
    constructor(
        private dataSource: DataSource,
    ){}

    public async createMany(createManyUsersDto: CreateManyUsersDto) {
            let newUsers: User[] = [];
            const queryRunner = this.dataSource.createQueryRunner()
            try {
                
                await queryRunner.connect()
        
                await queryRunner.startTransaction()
            } catch (error) {
                throw new RequestTimeoutException('Unable to connect to database')
            }
    
            try {
                for(let user of createManyUsersDto.users){
                    let newUser = queryRunner.manager.create(User, user);
                    let result = await queryRunner.manager.save(newUser);
                    newUsers.push(result);
                }
                await queryRunner.commitTransaction();
            } catch (error) {
                await queryRunner.rollbackTransaction();
                throw new ConflictException('Could not complete the transaction', {
        description: String(error),
      })
            }
            finally{
                try {
                    
                    await queryRunner.release();
                } catch (error) {
                    throw new RequestTimeoutException('Unable to release the query runner')
                }
            }
            return newUsers;
        }
}
