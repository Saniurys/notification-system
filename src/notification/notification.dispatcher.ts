import { Injectable } from '@nestjs/common';
import { NotificationStrategyFactory } from './strategies/notification-strategy.factory';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationDispatcher {
  constructor(private readonly strategyFactory: NotificationStrategyFactory) {}

  async dispatch(notification: Notification): Promise<void> {
    // 1. Pedir la estrategia a la Factory
    const strategy = this.strategyFactory.getStrategy(notification.type);
    
    // 2. Validar (aquí saltará el error de SMS si supera los 160 caracteres)
    strategy.validate(notification);
    
    // 3. Enviar (Pasamos un solo argumento para que no chille TS)
    await strategy.send(notification);
  }
}