import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
    @ApiProperty({ example: 'NewStrongPass123!' })
    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: 'La nueva contraseña debe tener al menos 8 caracteres' })
    newPassword!: string;
}