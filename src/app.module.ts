import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeORMConfig } from './config/typeorm.config';
import { AuthModule } from './module/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './module/users/users.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { MulterModule } from '@nestjs/platform-express';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { UploadModule } from '@/module/uploads/uploads.module';
import { QueryInterceptor } from '@/common/interceptors/query.interceptor';

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeORMConfig),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 1000000000,
      },
    ]),
    AuthModule,
    UploadModule,
    UsersModule,
    MulterModule.register({
      dest: './uploads', // Destination folder where uploaded files will be stored
    }),
    NestjsFormDataModule,
    ConfigModule.forRoot(),
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: QueryInterceptor,
    },
  ],
  // controllers: [UploadController],
})
export class AppModule {}
