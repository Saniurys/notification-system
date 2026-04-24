import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Repository } from 'typeorm';
import { Notification } from '../src/notification/entities/notification.entity';
import {
  initTestApp,
  closeTestApp,
  resetTestApp,
  getAuthToken,
  TestAppContext,
} from './helper/test-app.helper';

describe('NotificationController (e2e)', () => {
  let testContext: TestAppContext;
  let app: INestApplication;
  let notificationsRepository: Repository<Notification>;
  let authToken: string;

  beforeAll(async () => {
    testContext = await initTestApp();
    app = testContext.app;
    notificationsRepository = testContext.notificationsRepository;
  });

  afterAll(async () => {
    await closeTestApp(testContext);
  });

  beforeEach(async () => {
    await resetTestApp(testContext);
    // Cada test arranca con un token fresco
    authToken = await getAuthToken(app);
  });

  // ─── POST /notification ───────────────────────────────────────────────
  describe('POST /notification', () => {
    it('should create a notification when authenticated', async () => {
      const response = await request(app.getHttpServer())
        .post('/notification')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test notification',
          message: 'This is a test message',
          type: 'email',
        })
        .expect(201);

      expect(response.body.id).toBeDefined();
      expect(response.body.title).toBe('Test notification');
      expect(response.body.type).toBe('email');

      // Verificamos que realmente se guardó en la BD
      const saved = await notificationsRepository.findOneBy({ id: response.body.id });
      expect(saved).not.toBeNull();
    });

    it('should return 401 when no token is provided', async () => {
      await request(app.getHttpServer())
        .post('/notification')
        .send({
          title: 'Test',
          message: 'Test message',
          type: 'sms',
        })
        .expect(401);
    });

    it('should return 400 when required fields are missing', async () => {
      await request(app.getHttpServer())
        .post('/notification')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Solo título' }) // faltan message y type
        .expect(400);
    });
  });

  // ─── GET /notification ────────────────────────────────────────────────
  describe('GET /notification', () => {
    it('should return only notifications of the authenticated user', async () => {
      // Creamos dos notificaciones para el usuario actual
      await request(app.getHttpServer())
        .post('/notification')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Notif 1', message: 'Mensaje 1', type: 'sms' });

      await request(app.getHttpServer())
        .post('/notification')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Notif 2', message: 'Mensaje 2', type: 'push' });

      const response = await request(app.getHttpServer())
        .get('/notification')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveLength(2);
      //expect(response.body[1].title).toBe('Notif 2');
      //expect(response.body[0].title).toBe('Notif 1');
      const titles = response.body.map(n => n.title);
        expect(titles).toContain('Notif 1');
        expect(titles).toContain('Notif 2');
      
    });

    it('should return 401 when no token is provided', async () => {
      await request(app.getHttpServer())
        .get('/notification')
        .expect(401);
    });
  });

  // ─── PATCH /notification/:id ──────────────────────────────────────────
  describe('PATCH /notification/:id', () => {
    it('should update a notification', async () => {
      const created = await request(app.getHttpServer())
        .post('/notification')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Original', message: 'Mensaje original', type: 'email' });

      const response = await request(app.getHttpServer())
        .patch(`/notification/${created.body.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Actualizado' })
        .expect(200);

      expect(response.body.title).toBe('Actualizado');

      // Verificamos en la BD
      const updated = await notificationsRepository.findOneBy({ id: created.body.id });
      expect(updated?.title).toBe('Actualizado');
    });

    it('should return 401 when no token is provided', async () => {
      await request(app.getHttpServer())
        .patch('/notification/1')
        .send({ title: 'Hack' })
        .expect(401);
    });
  });

  // ─── DELETE /notification/:id ─────────────────────────────────────────
  describe('DELETE /notification/:id', () => {
    it('should delete a notification', async () => {
      const created = await request(app.getHttpServer())
        .post('/notification')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Para borrar', message: 'Mensaje', type: 'push' });

      await request(app.getHttpServer())
        .delete(`/notification/${created.body.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verificamos que ya no existe en la BD
      const deleted = await notificationsRepository.findOneBy({ id: created.body.id });
      expect(deleted).toBeNull();
    });

    it('should return 401 when no token is provided', async () => {
      await request(app.getHttpServer())
        .delete('/notification/1')
        .expect(401);
    });
  });
  // ─── PATCH /notification/:id/read (SEGURIDAD) ──────────────────────────
    describe('PATCH /notification/:id/read', () => {
        it('should return 404 when marking as read a notification from another user', async () => {
        // 1. Obtenemos el token del Usuario A (el principal del test)
        // authToken ya se generó en el beforeEach
        
        // Creamos una notificación en la BD para el Usuario A
        // Para saber el ID del usuario A, podemos hacer un GET /auth/profile o similar, 
        // pero lo más fácil es crearla vía API:
        const myNotifResponse = await request(app.getHttpServer())
            .post('/notification')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
            title: 'Notif de Usuario A',
            message: 'Secreta',
            type: 'email',
            });

        const notifId = myNotifResponse.body.id;

        // 2. Generamos token para el Usuario B (usando nuestro nuevo helper flexible)
        const tokenB = await getAuthToken(app, 'otro@email.com'); 

        // 3. Intentar marcar como leída la de A usando el token de B
        await request(app.getHttpServer())
            .patch(`/notification/${notifId}/read`)
            .set('Authorization', `Bearer ${tokenB}`)
            .expect(404); // El servicio debe lanzar NotFoundException si no es suya
        });

        it('should mark as read successfully if owned by user', async () => {
        const created = await request(app.getHttpServer())
            .post('/notification')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ title: 'Para leer', message: 'Test', type: 'sms' });

        await request(app.getHttpServer())
            .patch(`/notification/${created.body.id}/read`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);

        // Verificamos en BD
        const updated = await notificationsRepository.findOneBy({ id: created.body.id });
        expect(updated?.isRead).toBe(true);
        });
    });
});