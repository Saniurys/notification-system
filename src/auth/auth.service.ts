import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { EncryptionService } from './encryption.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly encryptionService: EncryptionService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    // 1. Buscamos al usuario por email o username (según tu DTO)
    const user = await this.userService.findByEmail(loginDto.email);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. Comparamos la contraseña usando tu EncryptionService
    const isPasswordValid = await this.encryptionService.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. Generamos el JWT
    const payload = { sub: user.id, username: user.username };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
          id: user.id,
          username: user.username,
          email: user.email
      }
    };
  }
}