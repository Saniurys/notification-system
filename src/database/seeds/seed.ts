import { AppDataSource } from '../../../data-source';
import * as bcrypt from 'bcrypt';

async function seed() {
  await AppDataSource.initialize();
  console.log('Database connected, running seed...');

  const userRepository = AppDataSource.getRepository('user');
  const notificationRepository = AppDataSource.getRepository('notification');

  // Limpiamos en orden correcto por la FK
    await notificationRepository.query('DELETE FROM notification');
    await userRepository.query('DELETE FROM "user"');

  // Creamos usuarios con password hasheado
  const users = await userRepository.save([
    {
      username: 'john_doe',
      email: 'john.doe@example.com',
      password: await bcrypt.hash('password123', 10),
    },
    {
      username: 'jane_doe',
      email: 'jane.doe@example.com',
      password: await bcrypt.hash('password456', 10),
    },
  ]);

  console.log(`Created ${users.length} users`);

  // Creamos notificaciones para cada usuario
  await notificationRepository.save([
    {
      userId: users[0].id,
      title: 'Bienvenido',
      message: 'Gracias por registrarte en el sistema',
      type: 'email',
    },
    {
      userId: users[0].id,
      title: 'Recordatorio',
      message: 'Tienes tareas pendientes',
      type: 'sms',
    },
    {
      userId: users[1].id,
      title: 'Nueva función',
      message: 'Ahora puedes recibir notificaciones push',
      type: 'push',
    },
  ]);

  console.log('Notifications created');
  console.log('Seed completed successfully!');

  await AppDataSource.destroy();
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});