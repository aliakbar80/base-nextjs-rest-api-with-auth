import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { SqlExceptionFilter } from './common/filters/sql-exception.filter';
import dataSource from './config/typeorm.config';
import { createDatabase } from './database/create-database';

async function bootstrap() {
  // Load environment variables from .env file
  dotenv.config();
  
  await createDatabase();
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
  });

  // Connect to the database
  await dataSource.initialize();

  // Serve uploaded files statically
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  // Enable CORS with specific configurations
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Set global prefix for API routes
  app.setGlobalPrefix('api/v1');

  // Use global validation pipe with transformation enabled
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // Configure Swagger for API documentation
  const config = new DocumentBuilder()
    .setTitle('‌Base System Rest Api')
    .setDescription(
      'This is a basic API system for developing systems with NestJS.',
    )
    // save bearer token
    .addBearerAuth()
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    jsonDocumentUrl: 'swagger/json',
  });

  // Use global filter for SQL exceptions
  app.useGlobalFilters(new SqlExceptionFilter());

  // Support JSON and URL-encoded bodies
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Start the application
  await app.listen(8080);
}

bootstrap();
