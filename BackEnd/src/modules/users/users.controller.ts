import { Controller, Get, Param, Patch, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get(':address/stats')
    async getUserStats(@Param('address') address: string) {
        return this.usersService.getUserStats(address);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('profile')
    async updateProfile(
        @CurrentUser() user: User,
        @Body() updateData: { username?: string; email?: string },
    ) {
        return this.usersService.updateProfile(user.id, updateData);
    }
}
