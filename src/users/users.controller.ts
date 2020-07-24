import { Controller, Get, UseGuards, Post, Body, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserD } from 'src/auth/user.decorator';

import { UsersService } from './users.service';
import { UpdateUserDTO } from './dto';
import { User } from './user.entity';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private usersService: UsersService,
  ) {}

  @Get('profile')
  @ApiOkResponse({
    description: 'Logged in user info',
    type: User
  })
  async profile(@UserD() user): Promise<any> {
    return this.usersService.findOne(user.id);
  }

  @Post('profile/update')
  @ApiOkResponse({
    description: 'Update user',
    type: User
  })
  async updateProfile(@UserD() user, @Body() data: UpdateUserDTO): Promise<any> {
    return this.usersService.updateOne(user.id, data);
  }

  @Get('isemailunique/:email')
  @ApiOkResponse({
    description: "Is email unique?",
    type: Boolean
  })
  async isEmailUnique(@UserD() user, @Param('email') email: string): Promise<boolean> {
    return await this.usersService.isEmailUnique(email, user.id);
  }
}
