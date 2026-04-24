import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import request from 'supertest';
import { User } from '../../src/user/entities/user.entity';
import { Notification } from '../../src/notification/entities/notification.entity';
import { AppModule } from '../../src/app.module';

export interface TestAppContext {
  app: INestApplication;
  dataSource: DataSource;
  usersRepository: Repository<User>;
  notificationsRepository: Repository<Notification>;
}

export async function initTestApp(): Promise<TestAppContext> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const dataSource = moduleFixture.get<DataSource>(DataSource);
  await dataSource.dropDatabase();
  await dataSource.synchronize();

  await app.init();

  return {
    app,
    dataSource,
    usersRepository: dataSource.getRepository(User),
    notificationsRepository: dataSource.getRepository(Notification),
  };
}

export async function closeTestApp(context: TestAppContext): Promise<void> {
  await context.dataSource.destroy();
  await context.app.close();
}

export async function resetTestApp(context: TestAppContext): Promise<void> {
  await context.dataSource.query('DELETE FROM notification');
  await context.dataSource.query('DELETE FROM "user"');
}

// Helper de autenticación: crea un usuario y devuelve su token
export async function getAuthToken(app: INestApplication, email: string = 'test@test.com'): Promise<string> {
  const username = email.split('@')[0]; // Saca 'testuser' de 'testuser@test.com'

  await request(app.getHttpServer())
    .post('/user')
    .send({
      username: username,
      email: email,
      password: 'Password123',
    });

  const response = await request(app.getHttpServer())
    .post('/auth/login')
    .send({
      email: email,
      password: 'Password123',
    });

  return response.body.access_token;
}
