import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  url: process.env.DATABASE_URL,
  port: process.env.PORT || 5000,
  synchronize: process.env.DATABASE_SYNC === 'true' ? true : false,
  autoLoadEntities: process.env.DATABASE_AUTOLOAD === 'true' ? true : false,
}));