import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      // 1. Extrae el token del header 'Authorization: Bearer <token>'
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // 2. Usa la misma clave secreta que definiremos en el Module
      secretOrKey: 'super-secret-key',//configService.get<string>('JWT_SECRET') || 'secretKey',
    });
  }

  // 3. Si el token es válido, este método se ejecuta automáticamente
  async validate(payload: any) {
    const user = await this.userService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }
    // Lo que retornes aquí se guardará en req.user
    return { id: payload.sub, username: payload.username };
  }
}