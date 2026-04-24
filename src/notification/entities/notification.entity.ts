import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { NotificationType } from '../constants/notification.constants';

@Entity('notification')
export class Notification {

    @ApiProperty({
        description: 'The unique identifier of the notification',
        example: 1,
    })
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (user) => user.notifications)
    user!: User;

    @Column()
    userId!: number;

    @ApiProperty({
        description: 'The title of the notification',
        example: 'New message received',
    })
    @Column()
    title!: string;

    @ApiProperty({
        description: 'The message of the notification',
        example: 'You have a new message from John Doe',
    })
    @Column()
    message!: string;

    @ApiProperty({
        description: 'The type of the notification',
        example: 'info',
    })
    @Column({
        type: 'enum',
        enum: NotificationType,
        default: NotificationType.SMS // o el que uses
    })
    type!: NotificationType;

    @ApiProperty({
        description: 'The date and time when the notification was created',
        example: '2023-01-01T00:00:00.000Z',
    })
    @CreateDateColumn()
    createdAt!: Date;

    @Column({ type: 'boolean', default: false })
    isRead!: boolean;

    @Column({ type: 'timestamp', nullable: true })
    readAt!: Date;
}
