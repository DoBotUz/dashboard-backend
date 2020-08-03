import * as fs from 'fs';
import { Controller, Get, UseGuards, Param, Post, Body, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor, FileFieldsInterceptor } from "@nestjs/platform-express";
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserD } from 'src/auth/user.decorator';
import { editFileName, imageFileFilter } from 'src/files/utils/file-upload.utils';
import { FeedbacksService } from './feedbacks.service';
import { AnswerFeedbackDto } from './dto';
import { BotNotificationsService } from 'src/bot-notifications/bot-notifications.service';
import { FilesService } from 'src/files/files.service';
import { Feedback } from './feedback.entity';
import { BotNotificationTemplate } from 'src/bot-notifications/bot-notification-template.entity';

@ApiTags('feedbacks')
@Controller('feedbacks')
@UseGuards(JwtAuthGuard)
export class FeedbacksController {
  constructor(
    private feedbackService: FeedbacksService,
    private botNotificationsService: BotNotificationsService,
    private filesService: FilesService,
  ) {}

  @Get(':bot_id/list')
  @ApiOkResponse({
    description: 'Array of feedbacks',
    isArray: true,
    type: Feedback
  })
  async list(@UserD() user, @Param("bot_id") bot_id): Promise<Feedback[]> {
    return this.feedbackService.listAllBots(bot_id);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Get feedback by id',
    type: Feedback
  })
  async get(@UserD() user, @Param("id") id): Promise<Feedback> {
    return await this.feedbackService.findOne(id);
  }

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
    data.template.type = BotNotificationTemplate.TYPES.FEEDBACK_ANS
    if (uploadedFiles && uploadedFiles.thumbnail && typeof uploadedFiles.thumbnail[0] !== 'undefined') {
      const thumbnail = uploadedFiles.thumbnail[0];
      data.template.thumbnail = thumbnail.filename;
      fs.rename(thumbnail.path, `./uploads/feedbacks/${thumbnail.filename}`, (res) => {
        if (res !== null)
          console.log(res);
      });
    }
    const model = await this.botNotificationsService.createTemplate(data);
    if (uploadedFiles && uploadedFiles.files && uploadedFiles.files.length) {
      this.filesService.uploadImagesFor('NOTIFICATION_TEMPLATE', model.id, uploadedFiles.files);
    }
    const notification = await this.botNotificationsService.create({
      bot_id: model.bot_id,
      bot_notification_template_id: model.id,
      after_date_time: 0,
      bot_user_ids: [data.bot_user_id]
    });
    this.botNotificationsService.setNotificationBotUsers(notification.id, [data.bot_user_id]);
    return model;
  }

}