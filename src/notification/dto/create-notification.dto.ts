import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsDateString, IsOptional} from "class-validator";
import {  NotificationType } from '../constants/notification.constants';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'The title of the notification',
    example: 'Nuevo aviso' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    description: 'The message of the notification',
    example: 'Tienes un mensaje nuevo' })
    @IsString()
    @IsNotEmpty()
  message!: string;

  @ApiProperty({
    description: 'The type of the notification',
    example: 'sms' })
  @IsString()
  @IsEnum(NotificationType)
  @IsNotEmpty()
  type!: NotificationType;

  @IsOptional()
  @IsDateString()
  createdAt?: string;

  
}
