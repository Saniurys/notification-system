import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ 
    description: 'El correo electrónico del usuario',
    example: 'john.doe@example.com' 
  })
  @IsEmail({}, { message: 'Debe ser un email válido' })
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ 
    description: 'La contraseña de la cuenta',
    example: 'strongpassword123' 
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password!: string;
}