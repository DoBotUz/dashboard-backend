import { Controller, UseGuards, Post, Param } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { UserD } from 'src/auth/user.decorator';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(
    private notificationsService: NotificationsService,
  ) {}

  @Post('/read-all')
  async readAll(@UserD() user): Promise<boolean> {
    this.notificationsService.readAll(user.id);
    return true;
  }

  @Post('/:id/read')
  async readOne(@Param('id') id, @UserD() user): Promise<boolean> {
    this.notificationsService.readOne(id);
    return true;
  }
}
