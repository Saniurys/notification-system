import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsEmail, MinLength} from "class-validator";


export class CreateUserDto {
    @ApiProperty({
        description: 'The username of the user',
        example: 'john_doe'
    })
     @IsString()
     @IsNotEmpty()
    username!: string;

    @ApiProperty({
        description: 'The email address of the user',
        example: 'john.doe@example.com'
    })
    @IsEmail({}, { message: 'El correo electrónico no es válido' })
     @IsNotEmpty()
    email!: string;

    @ApiProperty({
        description: 'The password of the user',
        example: 'strongpassword123'
    })
    @IsString()
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    password!: string;

    
    
}