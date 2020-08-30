import { Controller, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { Feature, CrudController, CrudAuth, Crud } from '@nestjsx/crud';
import { ApiTags } from '@nestjs/swagger';
import { User, STATUSES } from './user.entity';
import { UsersCrudService } from './users-crud.service';


@Crud({
  model: {
    type: User
  },
  routes: {
    only: ['getManyBase', 'getOneBase', 'createOneBase', 'deleteOneBase'],
  },
  query: {
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
    'organization.id': user.organizationId,
  })
})
@ApiTags('users')
@Controller('/:organizationId/users')
@UseGuards(JwtAuthGuard)
@Feature('users')
export class UsersController implements CrudController<User> {
  constructor(
    public service: UsersCrudService,
    private usersService: UsersService,
  ) {}

}
