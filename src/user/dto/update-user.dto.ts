import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiPropertyOptional({
        description: 'The username of the user',
        example: 'john_doe'
    })
    username?: string;

    @ApiPropertyOptional({
        description: 'The email address of the user',
        example: 'john.doe@example.com'
    })
    email?: string;
}
