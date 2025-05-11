import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * use global validation pipe to validate all incoming requests
   */

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  /**
   * use global prefix for all routes
   */
  app.setGlobalPrefix('api/v1');

  /**
   * swagger setup
   */

  const config = new DocumentBuilder()
    .setTitle('Game ID Buy Sell')
    .setDescription('Game ID Buy Sell API')
    .addServer('http://localhost:3000/api/v1')
    // .setTermsOfService('http://localhost:3000/terms-of-service')
    .setLicense(
      'MIT License',
      'https://github.com/git/git-scm.com/blob/main/MIT-LICENSE.txt',
    )
    .setVersion('1.0')
    // .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  //@ts-ignore
  await app.listen(process.env.PORT  );
}
bootstrap();
