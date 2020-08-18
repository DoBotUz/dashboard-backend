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


@Crud({
  model: {
    type: BotNotification
  },
  routes: {
    only: ['getManyBase', 'getOneBase'],
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
  filter: (user: User) => ({
    'organization.userId': user.id,
  })
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
    private mailingTemplatesService: MailingTemplatesService,
    private botUsersService: BotUsersService,
    private filesService: FilesService,
  ) {}

  @Post('mass-send')
  @ApiOkResponse({
    description: 'BotNotification',
    type: BotNotification
  })
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'thumbnail',
        maxCount: 1,
      },
      {
        name: 'files',
        maxCount: 20,
      }
    ], {
      storage: diskStorage({
        destination: 'tmp/uploads',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async createMassSend(@UserD() user, @Body() data: CreateMassSendDto, @UploadedFiles() uploadedFiles): Promise<BotNotification> {
    if (uploadedFiles && uploadedFiles.thumbnail && typeof uploadedFiles.thumbnail[0] !== 'undefined') {
      const thumbnail = uploadedFiles.thumbnail[0];
      data.template.thumbnail = thumbnail.filename;
      fs.rename(thumbnail.path, `./uploads/mailing-templates/${thumbnail.filename}`, (res) => {
        if (res !== null)
          console.log(res);
      });
    }
    const notificationTemplate = await this.mailingTemplatesService.createNew(data.template);
    if (uploadedFiles && uploadedFiles.files && uploadedFiles.files.length) {
      this.filesService.uploadImagesFor(FILE_KEYS.MAILING_TEMPLATE, notificationTemplate.id, uploadedFiles.files);
    }
    const model = await this.botNotificationsService.create({
      botId: data.botId,
      templateId: notificationTemplate.id,
      after_date_time: data.after_date_time
    });
    const bot_user_ids = (await this.botUsersService.listAllByBotId(data.botId)).map((botUser) => {
      return botUser.id;
    })
    this.botNotificationsService.setNotificationBotUsers(model.id, bot_user_ids);
    return this.botNotificationsService.findOne(model.id);
  }
}
