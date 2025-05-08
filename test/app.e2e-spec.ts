import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  // Increase timeout to 30 seconds
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  }, 30000); // Add timeout here

  afterAll(async () => {
    await app.close();
  }, 10000); // Add timeout here too

  it('/ (GET)', () => { 
    console.log(process.env.NODE_ENV);
    // console.log(process.env.S3_BUCKET);
    return request(app.getHttpServer())
      .get('/')
      .expect(200);
  }, 10000); // Add timeout to test
});
