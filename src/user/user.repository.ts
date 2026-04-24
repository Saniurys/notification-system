import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";

@Injectable()
export class UserRepository {
  
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    findById(id: number): Promise<User | null> {
        return this.userRepository.findOneBy({ id });
    }

    findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOneBy({ email });
    }

    findByUsername(username: string): Promise<User | null> {
        return this.userRepository.findOneBy({ username });
    }

    async create(userData: Partial<User>): Promise<User> {
        const user = this.userRepository.create(userData);
        return this.userRepository.save(user);
    }

    async update(id: number, userData: Partial<User>): Promise<User | null> {
        await this.userRepository.update(id, userData);
        return this.findById(id);
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.userRepository.delete(id);
        return result.affected !== 0; 
    }

    
}