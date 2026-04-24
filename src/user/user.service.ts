import { Injectable, Inject, NotFoundException, forwardRef } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserRepository } from "./user.repository";
import { EncryptionService } from '../auth/encryption.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';


@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository,
        @Inject(forwardRef(() => EncryptionService))
        private readonly encryptionService: EncryptionService,
    ) {}

    async findAll(): Promise<User[]> {
        return this.userRepository.findAll();
    }
 
    async findById(id: number): Promise<User> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return user;
    }

    async findByUsername(username: string): Promise<User | null> {
        return this.userRepository.findByUsername(username); 
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findByEmail(email);
    }

  async create(userData: CreateUserDto): Promise<User> { 
      const hashedPassword = await this.encryptionService.hash(userData.password);
      const userToSave = await this.userRepository.create({
          ...userData,
          password: hashedPassword,
      });
      return this.userRepository.create(userToSave);
  }

    async update(id: number, userData: Partial<User>): Promise<User> {
        const userToUpdate = { ...userData };
        // Si el usuario envió una password nueva, hay que encriptarla
        if (userData.password && userData.password.trim().length > 0) {
            userToUpdate.password = await this.encryptionService.hash(userData.password);
        }

        const updatedUser = await this.userRepository.update(id, userToUpdate);
        if (!updatedUser) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return updatedUser;
    }

    async changePassword(id: number, dto: ChangePasswordDto): Promise<void> {
        // 1. Verificamos que el usuario exista
        const user = await this.findById(id); 

        // 2. Encriptamos la NUEVA contraseña
        const hashedPassword = await this.encryptionService.hash(dto.newPassword);

        // 3. Mandamos solo el campo password al repositorio
        const updated = await this.userRepository.update(id, { password: hashedPassword });
        
        if (!updated) {
            throw new NotFoundException(`No se pudo actualizar la contraseña del usuario ${id}`);
        }
    }

    async delete(id: number): Promise<void> {
        const deleted = await this.userRepository.delete(id);
        if (!deleted) {
        throw new NotFoundException(`User with ID ${id} not found`);
        }
    }
}