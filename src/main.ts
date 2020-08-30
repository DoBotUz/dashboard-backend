import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe, ValidationError } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import AllExceptionsFilter from './all-exceptions.filter';
import { JSendResInterceptor } from './jsend-res.interceptor';
import { ValidationException } from './validation-exception';
import { ValidationExceptionFilter } from './validation-exception.filter';
import { join } from 'path';
import AllWsExceptionsFilter from './all-ws-exceptions.filter';
import { ACLFilterInterceptor } from './acl-filter.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {prefix: '/public/'});

  const options = new DocumentBuilder()
    .setTitle('DoBot backend')
    .setDescription('DoBot backend on nestjs kone4no')
    .setVersion('1.0')
    .addTag('dobot')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe(
    {
      transform: true,
      whitelist: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new ValidationException(validationErrors);
      }
    }
  ));

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalFilters(new ValidationExceptionFilter());
  app.enableCors();


  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.setGlobalPrefix('rest/v1');
  await app.listen(4000);
}
bootstrap();
