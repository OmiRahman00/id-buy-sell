import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { TagsModule } from './tags/tags.module';
import { MetaOptionsModule } from './meta-options/meta-options.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { appConfig } from './config/app.config';
import databaseConfig from './config/database.config';
import enviromentValidation from './config/enviroment.validation';


const ENV = process.env.NODE_ENV;



@Module({
  imports: [UserModule, PostModule, TagsModule, MetaOptionsModule, ConfigModule.forRoot(
    {
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      load: [appConfig, databaseConfig],
      validationSchema: enviromentValidation,
    }
  ),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject:[ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('database.url'),
        ssl: {
          rejectUnauthorized: false,
        },
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        autoLoadEntities: configService.get<boolean>('database.autoLoadEntities'),
        synchronize: configService.get<boolean>('database.synchronize'),
      }),
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
