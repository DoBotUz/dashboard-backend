import * as fs from 'fs';
import { Controller, Get, UseGuards, Param, Post, Body, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, Override, } from '@nestjsx/crud';
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
import { BotNotificationTemplate, TYPES } from 'src/bot-notifications/bot-notification-template.entity';
import { FeedbacksCrudService } from './feedbacks-crud.service';

@Crud({
  model: {
    type: Feedback
  }
})
@ApiTags('feedbacks')
@Controller('feedbacks')
@UseGuards(JwtAuthGuard)
export class FeedbacksController implements CrudController<Feedback> {
  constructor(
    public service: FeedbacksCrudService,
    private feedbackService: FeedbacksService,
    private botNotificationsService: BotNotificationsService,
    private filesService: FilesService,
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
    data.template.type = TYPES.FEEDBACK_ANS
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
      bot_id: model.bot.id,
      bot_notification_template_id: model.id,
      after_date_time: 0,
      bot_user_ids: [data.bot_user_id]
    });
    // this.botNotificationsService.setNotificationBotUsers(notification.id, [data.bot_user_id]);
    return model;
  }

}