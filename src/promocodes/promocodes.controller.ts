import { Controller, UseGuards, Body, BadRequestException, Post } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Crud, CrudController, Override, CrudAuth, Feature, Action } from "@nestjsx/crud";
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserD } from 'src/auth/user.decorator';
import { PromocodeCrudService } from './promocodes-crud.service';
import { CreatePromocodeDto, UpdatePromocodeDto } from './dto';
import { User } from 'src/users/user.entity';
import { PromocodesService } from './promocodes.service';
import { Promocode, STATUSES } from './promocode.entity';
import { OrganizationGuard } from 'src/common/guards/OrganizationsGuard';
import { UsersService } from 'src/users/users.service';
import { UpdatePromocodeStatusDto } from './dto/update-promocode.dto';
import { ACLGuard } from 'src/common/guards/ACL.guard';
import { AppRoles } from 'src/app.roles';


@Crud({
  model: {
    type: Promocode
  },
  routes: {
    only: ['getManyBase', 'getOneBase', 'createOneBase'],
  },
  query: {
    sort: [
      {
        field: 'id',
        order: 'DESC',
      },
    ],
    join: {
      organization: {
        eager: true,
      },
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
@ApiTags('promocodes')
@Controller('/:organizationId/promocodes')
@UseGuards(
  JwtAuthGuard,
  OrganizationGuard,
  ACLGuard
)
@Feature('promocode')
export class PromocodesController  implements CrudController<Promocode> {
  constructor(
    public service: PromocodeCrudService,
    private promocodesService: PromocodesService,
    private usersService: UsersService,
  ) {}
  
  @Override()
  @Action('Create-One')
  async createOne(@UserD() user, @Body() data: CreatePromocodeDto): Promise<Promocode> {
    return this.promocodesService.createNew(data);
  }

  @Post("/:organizationId/update")
  @ApiOkResponse({
    description: 'Updates one promocode',
    type: Promocode
  })
  @Action('Update-One')
  async updateOne(@UserD() user, @Body() updatePromocodeDto: UpdatePromocodeDto,): Promise<Promocode> {
    const { id, ...data } = updatePromocodeDto;
    return this.promocodesService.updateOne(id, data);
  }

  @Post("/:organizationId/status")
  @ApiOkResponse({
    description: 'Updates status',
    type: Promocode
  })
  @Action('Update-One')
  async updateStatus(@UserD() user, @Body() updateStatusDto: UpdatePromocodeStatusDto): Promise<Promocode> {
    const item = await this.promocodesService.findOne(updateStatusDto.id);
    await this.validateCall(user, Number(item.organizationId));
    const { id, ...data } = updateStatusDto;
    return this.promocodesService.updateOne(id, data);
  }

  private async validateCall(user: User, id: number){
    if (!user.roles.includes(AppRoles.admin)) {
      if (user.organizationId !== id) {
        throw new BadRequestException('Wrong input');
      }
      return;
    }

    const userEntity = await this.usersService.findOneWithOrganizations(user.id);

    if(!userEntity.organizations.some(org => org.id == id)) {
      throw new BadRequestException('Wrong input');
    }
  }
}
