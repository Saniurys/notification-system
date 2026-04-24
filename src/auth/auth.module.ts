import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EncryptionService } from './encryption.service';
import { JwtStrategy } from './strategies/jwt.strategy';
@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: 'super-secret-key',//config.get<string>('JWT_SECRET') || 'secretKey',
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  providers: [
    AuthService, 
    EncryptionService, 
    JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, EncryptionService, PassportModule, JwtModule],
})
export class AuthModule {}