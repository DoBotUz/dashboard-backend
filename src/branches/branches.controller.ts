import { Controller, UseGuards, Param, Post, Get, Body, BadRequestException, UploadedFile, UseInterceptors, } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudAuth, Override, Feature, Action } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { BranchesService } from './branches.service';
import { Branch, STATUSES } from './branch.entity';
import { BranchesCrudService } from './branches-crud.service';
import { CreateBranchDto, UpdateBranchDto, UpdateBranchStatusDto } from './dto';
import { UserD } from 'src/auth/user.decorator';
import { User } from 'src/users/user.entity';
import { OrganizationGuard } from '../common/guards/OrganizationsGuard';
import { UsersService } from 'src/users/users.service';
import { FilesService } from 'src/files/files.service';
import { File, KEYS as FILE_KEYS } from 'src/files/file.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, imageFileFilter } from 'src/files/utils/file-upload.utils';
import { diskStorage } from 'multer';
import { ACLGuard } from 'src/common/guards/ACL.guard';
import { AppRoles } from 'src/app.roles';


@Crud({
  model: {
    type: Branch
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
@ApiTags('branches')
@Controller('/:organizationId/branches')
@UseGuards(
  JwtAuthGuard,
  OrganizationGuard,
  ACLGuard
)
@Feature('branches')
export class BranchesController implements CrudController<Branch> {
  constructor(
    public service: BranchesCrudService,
    private branchesService: BranchesService,
    private usersService: UsersService,
    private filesService: FilesService,
  ) {}

  @Override()
  @Action('Create-One')
  async createOne(@UserD() user, @Body() data: CreateBranchDto): Promise<Branch> {
    await this.validateCall(user, data.organizationId);

    return this.branchesService.createNew(data);
  }

  @Post("/update")
  @ApiOkResponse({
    description: 'Updates one branch',
    type: Branch
  })
  @Action('Update-One')
  async updateOne(@UserD() user, @Body() updateBranchDto: UpdateBranchDto): Promise<Branch> {
    const model = await this.branchesService.findOne(updateBranchDto.id);
    await this.validateCall(user, model.organizationId);

    const { id, ...data } = updateBranchDto;
    return this.branchesService.updateOne(id, data);
  }

  @Post("/status")
  @ApiOkResponse({
    description: 'Updates status',
    type: Branch
  })
  @Action('Update-One')
  async updateStatus(@UserD() user, @Body() updateStatusDto: UpdateBranchStatusDto): Promise<Branch> {
    const item = await this.branchesService.findOne(updateStatusDto.id);
    await this.validateCall(user, item.organizationId);
    const { id, ...data } = updateStatusDto;
    return this.branchesService.updateOne(id, data);
  }

  @Get(':id/files')
  @Action('Read-One')
  async getFiles(@UserD() user, @Param('id') id): Promise<File[]> {
    await this.validateCall(user, id);
    return this.filesService.findFilesByKeyAndId(FILE_KEYS.BRANCH, id);
  }

  @Post(":id/add-file")
  @ApiOkResponse({
    description: 'Add file to file list',
    type: Boolean
  })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: 'tmp/uploads',
      filename: editFileName,
    }),
    fileFilter: imageFileFilter,
  }))
  @Action('Update-One')
  async addFile(@Param("id") id, @UploadedFile() file): Promise<boolean> {
    this.filesService.uploadImagesFor(FILE_KEYS.BRANCH, id, [file]);
    return true;
  }

  @Post(":id/remove-file")
  @ApiOkResponse({
    description: 'Remove file from list',
    type: Boolean
  })
  @Action('Update-One')
  async removeFile(@Param("id") id): Promise<boolean> {
    this.filesService.remove(id);
    return true;
  }

  private async validateCall(user, id){
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
