import { Injectable, BadRequestException } from '@nestjs/common';
import { INotificationStrategy } from './notification-strategy.interface';
import { Notification } from '../entities/notification.entity';

@Injectable()
export class PushStrategy implements INotificationStrategy {
  validate(notification: Notification): void {
    if (!notification.message) {
      throw new BadRequestException('Push message cannot be empty');
    }
  }

  async send(notification: Notification): Promise<void> {
    // Aquí iría Firebase Cloud Messaging (FCM)
    console.log(`[PUSH SENT] Device Token found for user: ${notification.user.username}`);
  }
}