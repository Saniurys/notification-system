import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true, // En desarrollo, esto permite cualquier origen (React, Angular, etc.)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 1. EL VIGILANTE: Activa las validaciones de class-validator
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Borra campos que no estén en el DTO (seguridad extra)
    forbidNonWhitelisted: true, // Lanza error si envían campos de más
    transform: true, // Convierte tipos automáticamente (como el id string a number)
  }));

   // 2. EL FILTRO: Para que funcione el @Exclude() y ocultar passwords
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // 3. DOCUMENTACIÓN: Configura Swagger para documentar tu API
  const config = new DocumentBuilder()
  .setTitle('Notification System API')
  .setDescription('API for managing users in the Notification System application')
  .setVersion('1.0')
  .addBearerAuth()
  .addTag('users')
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
