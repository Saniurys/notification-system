import { Injectable, BadRequestException } from '@nestjs/common';
import { INotificationStrategy } from './notification-strategy.interface';
import { Notification } from '../entities/notification.entity';

@Injectable()
export class EmailStrategy implements INotificationStrategy {
  validate(notification: Notification): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Asumimos que el "recipient" está en alguna parte o validamos el mensaje
    if (!notification.message || notification.message.length < 5) {
      throw new BadRequestException('Email content is too short');
    }
    console.log('Validating Email format...');
  }

  async send(notification: Notification): Promise<void> {
    // Aquí iría la lógica de Nodemailer o Amazon SES
    console.log(`[EMAIL SENT] To: ${notification.user.email} - Subject: Notification`);
  }
}