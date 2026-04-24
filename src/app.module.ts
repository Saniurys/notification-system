import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { NotificationModule } from './notification/notification.module';
import { DatabaseModule } from './database/database.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Esto hace que no tengas que importarlo en cada módulo
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
    }),
    DatabaseModule,
    UserModule,
    NotificationModule,
    NotificationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
