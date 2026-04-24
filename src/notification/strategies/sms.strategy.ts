import { Injectable, BadRequestException } from '@nestjs/common';
import { INotificationStrategy } from './notification-strategy.interface';
import { Notification } from '../entities/notification.entity';

@Injectable() // 👈 Importante para que la Factory lo pueda usar
export class SmsStrategy implements INotificationStrategy {
  validate(notification: Notification) {
    if (notification.message.length > 160) {
      throw new BadRequestException('SMS content cannot exceed 160 characters');
    }
  }

  async send(notification: Notification) {
    console.log(`[SMS] Sending to user: ${notification.user.username}`); 
  }
}