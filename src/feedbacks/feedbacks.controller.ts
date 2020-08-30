import { Controller, UseGuards, Post, Body, BadRequestException } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudAuth, Feature, Action, } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserD } from 'src/auth/user.decorator';
import { FeedbacksService } from './feedbacks.service';
import { UpdateFeedbackStatusDto } from './dto';
import { Feedback, STATUSES } from './feedback.entity';
import { FeedbacksCrudService } from './feedbacks-crud.service';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { OrganizationGuard } from 'src/common/guards/OrganizationsGuard';
import { ACLGuard } from 'src/common/guards/ACL.guard';

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
  OrganizationGuard,
  ACLGuard
)
@Feature('feedbacks')
export class FeedbacksController implements CrudController<Feedback> {
  constructor(
    public service: FeedbacksCrudService,
    private feedbackService: FeedbacksService,
    private usersService: UsersService,
  ) {}

  @Post("/status")
  @ApiOkResponse({
    description: 'Updates status',
    type: Feedback
  })
  @Action('Update-One')
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