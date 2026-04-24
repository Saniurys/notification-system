import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationStrategyFactory } from './strategies/notification-strategy.factory';
import { EmailStrategy } from './strategies/email.strategy';
import { SmsStrategy } from './strategies/sms.strategy';
import { PushStrategy } from './strategies/push.strategy';
import { Notification } from './entities/notification.entity';
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { NotificationDispatcher } from './notification.dispatcher';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, User]),
  PassportModule,
  AuthModule],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    NotificationDispatcher,
    NotificationStrategyFactory,
    EmailStrategy,
    SmsStrategy,   
    PushStrategy,
  ],
})
export class NotificationModule {}
