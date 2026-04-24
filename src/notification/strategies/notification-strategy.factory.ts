import { Injectable, BadRequestException } from '@nestjs/common';
import { NotificationType } from '../constants/notification.constants';
import { INotificationStrategy } from './notification-strategy.interface';
import { EmailStrategy } from './email.strategy';
import { SmsStrategy } from './sms.strategy';
import { PushStrategy } from './push.strategy';

@Injectable()
export class NotificationStrategyFactory {
  // Definimos nuestro "Hashmap"
  private strategies: Map<NotificationType, INotificationStrategy>;

  constructor(
    private readonly emailStrategy: EmailStrategy,
    private readonly smsStrategy: SmsStrategy,
    private readonly pushStrategy: PushStrategy,
  ) {
    // Inicializamos el mapa asociando cada tipo con su clase correspondiente
    this.strategies = new Map<NotificationType, INotificationStrategy>([
      [NotificationType.EMAIL, this.emailStrategy],
      [NotificationType.SMS, this.smsStrategy],
      [NotificationType.PUSH, this.pushStrategy],
    ]);
  }

  getStrategy(type: NotificationType): INotificationStrategy {
    const strategy = this.strategies.get(type);

    if (!strategy) {
      throw new BadRequestException(`El canal de notificación "${type}" no está soportado.`);
    }

    return strategy;
  }
}