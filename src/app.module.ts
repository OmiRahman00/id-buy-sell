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
import { PaginationModule } from './common/pagination/pagination.module';
import { AuthModule } from './auth/auth.module';
import databaseConfig from './config/database.config';
import enviromentValidation from './config/enviroment.validation';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from 'src/auth/config/jwt.config';
import { AccessTokenGuard } from './auth/gaurds/access-token/access-token.guard';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthenticationGuard } from './auth/gaurds/authentication/authentication.guard';
import { DataResponseInterceptor } from './common/interceptors/data-response/data-response.interceptor';
import { MailModule } from './mail/mail.module';


const ENV = process.env.NODE_ENV;



@Module({
  imports: [UserModule, PostModule, TagsModule, MetaOptionsModule, ConfigModule.forRoot(
    {
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      // envFilePath: '.env.development',
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
    }),
    PaginationModule,
    AuthModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService,
  {
    provide: APP_GUARD,
    useClass: AuthenticationGuard, 
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: DataResponseInterceptor,  //globally add interceptor to the whole system
  },
  AccessTokenGuard,
  ],
})
export class AppModule { }
