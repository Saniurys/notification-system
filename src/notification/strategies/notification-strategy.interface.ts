import { Notification } from '../entities/notification.entity';

export interface INotificationStrategy {
  validate(notification: Notification): void;
  send(notification: Notification): Promise<void>;
}