import * as fs from 'fs';
import { Controller, Get, UseGuards, Param, Post, Body, UseInterceptors, UploadedFile, UploadedFiles, BadRequestException } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, Override, CrudAuth, } from '@nestjsx/crud';
import { FileInterceptor, FileFieldsInterceptor } from "@nestjs/platform-express";
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserD } from 'src/auth/user.decorator';
import { editFileName, imageFileFilter } from 'src/files/utils/file-upload.utils';
import { FeedbacksService } from './feedbacks.service';
import { AnswerFeedbackDto, UpdateFeedbackStatusDto } from './dto';
import { BotNotificationsService } from 'src/bot-notifications/bot-notifications.service';
import { FilesService } from 'src/files/files.service';
import { Feedback, STATUSES } from './feedback.entity';
import { BotNotificationTemplate, TYPES } from 'src/bot-notifications/bot-notification-template.entity';
import { FeedbacksCrudService } from './feedbacks-crud.service';
import { User } from 'src/users/user.entity';
import { BotGuard } from 'src/common/guards/BotsGuard';
import { UsersService } from 'src/users/users.service';
import { OrganizationGuard } from 'src/common/guards/OrganizationsGuard';

@Crud({
  model: {
    type: Feedback
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
      organization: {
        eager: true,
        select: false,
      },
      bot_user: {
        eager: true
      }
    },
    filter: {
      status: {
        $ne: STATUSES.DELETED,
      }
    }
  },
  params: {
    organizationId: {
      field: 'organizationId',
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
@ApiTags('feedbacks')
@Controller('/:organizationId/feedbacks')
@UseGuards(
  JwtAuthGuard,
  OrganizationGuard
)
export class FeedbacksController implements CrudController<Feedback> {
  constructor(
    public service: FeedbacksCrudService,
    private feedbackService: FeedbacksService,
    private botNotificationsService: BotNotificationsService,
    private filesService: FilesService,
    private usersService: UsersService,
  ) {}

  @Post('answer')
  @ApiOkResponse({
    description: 'BotNotificationTemplate',
    type: BotNotificationTemplate
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
  async answer(@UserD() user, @Body() data: AnswerFeedbackDto, @UploadedFiles() uploadedFiles): Promise<BotNotificationTemplate> {
    const feedbackModel = await this.feedbackService.findOneWithBot(data.id);
    await this.validateCall(user, feedbackModel.bot.organizationId);

    if (uploadedFiles && uploadedFiles.thumbnail && typeof uploadedFiles.thumbnail[0] !== 'undefined') {
      const thumbnail = uploadedFiles.thumbnail[0];
      data.template.thumbnail = thumbnail.filename;
      fs.rename(thumbnail.path, `./uploads/feedbacks/${thumbnail.filename}`, (res) => {
        if (res !== null)
          console.log(res);
      });
    }

    data.template.type = TYPES.FEEDBACK_ANS
    const model = await this.botNotificationsService.createTemplate(data);

    if (uploadedFiles && uploadedFiles.files && uploadedFiles.files.length) {
      this.filesService.uploadImagesFor('NOTIFICATION_TEMPLATE', model.id, uploadedFiles.files);
    }

    const notification = await this.botNotificationsService.create({
      botId: model.botId,
      templateId: model.id,
    });
    
    this.botNotificationsService.setNotificationBotUsers(notification.id, [feedbackModel.botUserId]);
    return model;
  }

  @Post("/status")
  @ApiOkResponse({
    description: 'Updates status',
    type: Feedback
  })
  async updateStatus(@UserD() user, @Body() updateStatusDto: UpdateFeedbackStatusDto): Promise<Feedback> {
    const item = await this.feedbackService.findOne(updateStatusDto.id);
    await this.validateCall(user, item.organizationId);
    const { id, ...data } = updateStatusDto;
    return this.feedbackService.updateOne(id, data);
  }

  private async validateCall(user, id){
    const userEntity = await this.usersService.findOneWithOrganizations(user.id);

    if(!userEntity.organizations.some(org => org.id == id)) {
      throw new BadRequestException('Wrong input');
    }
  }

}