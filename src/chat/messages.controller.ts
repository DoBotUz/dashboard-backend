import { Controller, UseGuards, Param, Post, Body, UseInterceptors, UploadedFile, UploadedFiles, BadRequestException, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, Override, CrudAuth, ParsedBody, ParsedRequest, CrudRequest, } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OrganizationGuard } from 'src/common/guards/OrganizationsGuard';
import { UserD } from 'src/auth/user.decorator';
import { Message } from './message.entity';
import { MessagesService } from './messages.service';
import { User } from 'src/users/user.entity';

@Crud({
  model: {
    type: Message
  },
  query: {
    sort: [{
      field: 'created_at',
      order: 'DESC'
    }],
    join: {
      organization: {
        eager: true
      },
      operator: {
        eager: true
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
@Controller('/:organizationId/chat/messages')
@UseGuards(
  JwtAuthGuard,
  OrganizationGuard
)
export class MessagesController implements CrudController<Message> {
  constructor(
    public service: MessagesService
  ) {}

  get base(): CrudController<Message> {
    return this;
  }


  @Override()
  async createOne(@ParsedRequest() request: CrudRequest, @Body() body) { // TODO: make dto
    const data = await this.base.createOneBase(request, body);
    this.service.notifyAboutMessage(data);
    return data;
  }

  @Get('read/:botUser')
  read(@Param('botUser') botUserId) {
    return this.service.repo.update({
      author: botUserId,
      is_read: false
    }, {
      is_read: true
    });
  }

  @Get('chats')
  async getChats(@Param('organizationId') orgId) {
    return this.service.getChats(orgId);
  }

  @Get('/:botUser')
  async getChatLog(@Param('organizationId') orgId, @Param('botUser') botUserId) {
    return this.service.getChatLog(orgId, botUserId);
  }

  @Get('/search')
  async search(@Query('q') query) {
    return this.service.search(query);
  }
}
