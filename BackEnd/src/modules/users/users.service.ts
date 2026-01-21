import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async findByAddress(stellarAddress: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { stellarAddress } });
    }

    async findById(id: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { id } });
    }

    async create(stellarAddress: string, role: UserRole = UserRole.USER): Promise<User> {
        const user = this.userRepository.create({
            stellarAddress,
            role,
        });
        return this.userRepository.save(user);
    }

    async updateProfile(
        id: string,
        data: { username?: string; email?: string },
    ): Promise<User> {
        const user = await this.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        Object.assign(user, data);
        return this.userRepository.save(user);
    }

    async getUserStats(address: string): Promise<{
        stellarAddress: string;
        username: string | null;
        xp: number;
        level: number;
    }> {
        const user = await this.findByAddress(address);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        return {
            stellarAddress: user.stellarAddress,
            username: user.username,
            xp: user.xp,
            level: user.level,
        };
    }

    async addXp(userId: string, xpAmount: number): Promise<User> {
        const user = await this.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        user.xp += xpAmount;
        // Simple leveling: every 1000 XP = 1 level
        user.level = Math.floor(user.xp / 1000) + 1;

        return this.userRepository.save(user);
    }
}
