import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './entities/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { NotificationStrategyFactory } from './strategies/notification-strategy.factory';
import { NotificationDispatcher } from './notification.dispatcher';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    //private readonly strategyFactory: NotificationStrategyFactory,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dispatcher: NotificationDispatcher,
  ) {}


  async create(createNotificationDto: CreateNotificationDto, userId: number) {
    // 1. Buscamos el usuario
    const user = await this.userRepository.findOneBy({ id: userId });
    
    // 2. Validación de existencia (Esto "limpia" el posible 'null')
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // 3. Instanciamos la notificación
    // Usamos 'user' directamente porque ya validamos que no es null
    const newNotification = this.notificationRepository.create({
      title: createNotificationDto.title,
      message: createNotificationDto.message,
      type: createNotificationDto.type,
      user: user, // Aquí TypeScript ya sabe que user NO es null
    });

    // 4. El dispatcher (Asegúrate de que reciba solo 1 argumento si así lo definimos)
    await this.dispatcher.dispatch(newNotification);

    // 5. Guardamos
    return await this.notificationRepository.save(newNotification);
  }


  async findAll(userId: number, isRead?: boolean) {
    return this.notificationRepository.find({
      where: {
        user: { id: Number(userId) } as User,
        ...(isRead !== undefined && { isRead }) // Solo filtra por isRead si el parámetro existe
      },
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number, userId: number) {
    const notification = await this.notificationRepository.findOne({
      where: { 
        id: id,
        user: { id: userId } },
    });
    if (!notification) {
      throw new NotFoundException(`Notification #${id} not found`);
    }
    return notification;
  }

  async update(id: number, updateNotificationDto: UpdateNotificationDto, userId: number) {
    const notification = await this.findOne(id, userId);
    Object.assign(notification, updateNotificationDto);
    return this.notificationRepository.save(notification);
  }

  async remove(id: number, userId: number) {
    const notification = await this.findOne(id, userId);
    return this.notificationRepository.remove(notification);
  }

async markAsRead(id: number, userId: number) {
    const notification = await this.notificationRepository.findOneBy({ 
      id: Number(id), 
      user: { id: Number(userId) }
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    notification.isRead = true;
    notification.readAt = new Date();
    
    return this.notificationRepository.save(notification);
  }
}
