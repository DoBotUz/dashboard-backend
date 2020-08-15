import { Controller, UseGuards, Body, ValidationPipe, UsePipes, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Crud, CrudController, Override, CrudAuth } from "@nestjsx/crud";
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserD } from 'src/auth/user.decorator';
import { PromocodeCrudService } from './promocodes-crud.service';
import { CreatePromocodeDto, UpdatePromocodeDto } from './dto';
import { User } from 'src/users/user.entity';
import { ValidationError } from 'class-validator';
import { ValidationException } from 'src/validation-exception';
import { PromocodesService } from './promocodes.service';
import { Promocode } from './promocode.entity';
import { OrganizationGuard } from 'src/common/guards/OrganizationsGuard';
import { UsersService } from 'src/users/users.service';


@Crud({
  model: {
    type: Promocode
  },
  routes: {
    only: ['getManyBase', 'getOneBase', 'updateOneBase', 'createOneBase'],
  },
  query: {
    join: {
      organization: {
        eager: true,
      },
    },
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
)
export class PromocodesController  implements CrudController<Promocode> {
  constructor(
    public service: PromocodeCrudService,
    private promocodesService: PromocodesService,
    private usersService: UsersService,
  ) {}
  
  @Override()
  async createOne(@UserD() user, @Body() data: CreatePromocodeDto): Promise<any> {
    return;
  }

  @Override()
  async updateOne(@UserD() user, @Body() updateOrganizationDTO: UpdatePromocodeDto,): Promise<any> {
    return;
  }

  private async validateCall(user: User, id: number){
    const userEntity = await this.usersService.findOneWithOrganizations(user.id);

    if(!userEntity.organizations.some(org => org.id == id)) {
      throw new BadRequestException('Wrong input');
    }
  }
}
