import { Controller, UseGuards, BadRequestException, Post, Body, UploadedFile, UseInterceptors, Delete, Get, Param } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { Feature, CrudController, CrudAuth, Crud, Action, Override } from '@nestjsx/crud';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { User, STATUSES } from './user.entity';
import { UsersCrudService } from './users-crud.service';
import { AppRoles } from 'src/app.roles';
import { UserD } from 'src/auth/user.decorator';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter, editFileName } from 'src/files/utils/file-upload.utils';
import { UpdateUserDto, CreateUserDto, UpdateUserStatusDto } from './dto';
import { ACLGuard } from 'src/common/guards/ACL.guard';


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
@UseGuards(JwtAuthGuard, ACLGuard)
@Feature('users')
export class UsersController implements CrudController<User> {
  constructor(
    public service: UsersCrudService,
    private usersService: UsersService,
  ) {}

  @Override()
  @UseInterceptors(FileInterceptor('avatar', {
    storage: diskStorage({
      destination: 'uploads/users/',
      filename: editFileName,
    }),
    fileFilter: imageFileFilter,
  }))
  @Action('Create-One')
  async createOne(@UserD() user, @Body() data: CreateUserDto,  @UploadedFile() avatar): Promise<User> {
    await this.validateCall(user, Number(data.organizationId));
    await this.validateRoleVal(user, data.role);

    if (avatar) {
      data.avatar = avatar.filename;
    }
    return this.usersService.createNew(data);
  }

  @Post('/update')
  @ApiOkResponse({
    description: 'Update user',
    type: User
  })
  @UseInterceptors(FileInterceptor('avatar', {
    storage: diskStorage({
      destination: 'uploads/users/',
      filename: editFileName,
    }),
    fileFilter: imageFileFilter,
  }))
  @Action('Update-One')
  async updateOne(@UserD() user, @Body() updateUserDto: UpdateUserDto,  @UploadedFile() avatar): Promise<any> {
    const userModel = await this.usersService.findOne(updateUserDto.id);
    await this.validateCall(user, Number(userModel.organizationId));
    await this.validateRoleVal(user, updateUserDto.role);

    if (avatar) {
      updateUserDto.avatar = avatar.filename;
    }
    
    const { id, ...data } = updateUserDto;
    return this.usersService.updateOne(id, data);
  }

  @Delete('/:id/delete-avatar')
  @ApiOkResponse({
    description: 'Update user',
    type: User
  })
  @Action('Update-One')
  async deleteAvatar(@UserD() user, @Param('id') id: number): Promise<any> {
    const userModel = await this.usersService.findOne(id);
    await this.validateCall(user, Number(userModel.organizationId));
    return this.usersService.updateOne(id, {
      avatar: '',
    });
  }

  @Get('isemailunique/:email')
  @ApiOkResponse({
    description: "Is email unique?",
    type: Boolean
  })
  async isEmailUnique(@Param('email') email: string): Promise<boolean> {
    return await this.usersService.isEmailUnique(email);
  }
  
  @Post("/status")
  @ApiOkResponse({
    description: 'Updates status',
    type: User
  })
  @Action('Update-One')
  async updateStatus(@UserD() user, @Body() updateStatusDto: UpdateUserStatusDto): Promise<User> {
    const userModel = await this.usersService.findOne(updateStatusDto.id);
    await this.validateCall(user, Number(userModel.organizationId));
    const { id, ...data } = updateStatusDto;
    return this.usersService.updateOne(id, data);
  }

  private async validateCall(user, id: number){
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

  private validateRoleVal(user: User, role: string) {
    if(user.roles.includes(AppRoles.admin))
      return;
    
    if (user.roles.includes(AppRoles.owner) && role === AppRoles.admin) {
      throw new BadRequestException('Wrong Role');
    }

    if(user.roles.includes(AppRoles.manager) && (role === AppRoles.admin || role === AppRoles.owner)) {
      throw new BadRequestException('Wrong Role');
    }

    // А Оператор не может редактировать вообще!
  }
}
