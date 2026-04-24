import { Controller, Get, Post, Body, Patch, Param, Delete, Query} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { GetUser, Auth } from '../common/decorators';


@ApiTags('notification')
@Auth()
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  async create(
    @Body() dto: CreateNotificationDto, 
    @GetUser('id') userId: number) {
    const idUser = userId; 
    console.log('User ID from JWT:', idUser);
    return this.notificationService.create(dto, idUser);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las notificaciones con filtro opcional' })
  @ApiQuery({ name: 'isRead', required: false, type: Boolean, description: 'Filtrar por estado de lectura' })
  findAll(
    @GetUser('id') userId: number,
    @Query('isRead') isRead?: string // Los query params llegan como string
  ) {
    // Convertimos el string 'true'/'false' a booleano real
    const filter = isRead === 'true' ? true : isRead === 'false' ? false : undefined;
    return this.notificationService.findAll(userId, filter);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string, 
    @GetUser('id') userId: number) {
    return this.notificationService.findOne(+id,userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updateNotificationDto: UpdateNotificationDto, 
    @GetUser('id') userId: number) {
    return this.notificationService.update(+id, updateNotificationDto,userId);
  }

  @Delete(':id')
  remove( 
    @Param('id') id: string, 
    @GetUser('id') userId: number) {
    return this.notificationService.remove(+id, userId);
  }

  @ApiOperation({ summary: 'Marcar una notificación como leída' })
  @ApiResponse({ status: 200, description: 'Notificación actualizada correctamente' })
  @ApiResponse({ status: 404, description: 'No encontrada o no pertenece al usuario' })
  @Patch(':id/read')
  async markAsRead(
      @Param('id') id: number,
      @GetUser('id') userId: number
  ) {
      return this.notificationService.markAsRead(id, userId);
  }
}
