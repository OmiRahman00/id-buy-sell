import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { ConfigModule } from '@nestjs/config';
import { UserCreateManyService } from './user-create-many.service';
import profileConfig from './config/profile.config';

@Module({
  imports:[TypeOrmModule.forFeature([User]),ConfigModule.forFeature(profileConfig)],
  controllers: [UserController],
  providers: [UserService, UserCreateManyService],
  exports: [UserService],
})
export class UserModule {}
