import * as fs from 'fs';
import { Controller, UseGuards, Post, Body, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudAuth, } from '@nestjsx/crud';
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserD } from 'src/auth/user.decorator';
import { editFileName, imageFileFilter } from 'src/files/utils/file-upload.utils';
import { BotNotificationsService } from './bot-notifications.service';
import { CreateMassSendDto } from './dto';
import { BotNotification } from './bot-notification.entity';
import { FilesService } from 'src/files/files.service';
import { KEYS as FILE_KEYS } from 'src/files/file.entity';
import { BotUsersService } from 'src/bot-users/bot-users.service';
import { BotNotificationsCrudService } from './bot-notifications-crud.service';
import { User } from 'src/users/user.entity';
import { BotGuard } from 'src/common/guards/BotsGuard';
import { MailingTemplatesService } from 'src/mailing-templates/mailing-templates.service';
import { AppRoles } from 'src/app.roles';


@Crud({
  model: {
    type: BotNotification
  },
  routes: {
    only: [],
  },
  query: {
    sort: [
      {
        field: 'id',
        order: 'DESC',
      },
    ],
    join: {
      bot: {
        eager: true,
      },
      'bot.organization': {
        eager: true,
        select: false,
      },
    },
  },
  params: {
    botId: {
      field: 'botId',
      type: 'number'
    },
  },
})
@CrudAuth({
  property: 'user',
  filter: (user: User) => {
    if (user.role == AppRoles.admin)
      return { 'organization.userId': user.id }
    return { 'organization.id': user.organizationId }
  }
})
@ApiTags('bot-notifications')
@Controller('/:botId/bot-notifications')
@UseGuards(
  JwtAuthGuard,
  BotGuard
)
export class BotNotificationsController implements CrudController<BotNotification>{
  constructor(
    public service: BotNotificationsCrudService,
    private botNotificationsService: BotNotificationsService,
  ) {}
}
