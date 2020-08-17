import { Controller, UseGuards, Param, Post, Get, Body, BadRequestException, UploadedFile, UseInterceptors, } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudAuth, Override } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { BranchesService } from './branches.service';
import { Branch } from './branch.entity';
import { BranchesCrudService } from './branches-crud.service';
import { CreateBranchDto, UpdateBranchDto } from './dto';
import { UserD } from 'src/auth/user.decorator';
import { User } from 'src/users/user.entity';
import { OrganizationGuard } from '../common/guards/OrganizationsGuard';
import { UsersService } from 'src/users/users.service';
import { FilesService } from 'src/files/files.service';
import { File, KEYS as FILE_KEYS } from 'src/files/file.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, imageFileFilter } from 'src/files/utils/file-upload.utils';
import { diskStorage } from 'multer';


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
  OrganizationGuard
)
export class BranchesController implements CrudController<Branch> {
  constructor(
    public service: BranchesCrudService,
    private branchesService: BranchesService,
    private usersService: UsersService,
    private filesService: FilesService,
  ) {}

  @Override()
  async createOne(@UserD() user, @Body() data: CreateBranchDto): Promise<Branch> {
    await this.validateCall(user, data.organizationId);

    return this.branchesService.createNew(data);
  }

  @Post("/update")
  @ApiOkResponse({
    description: 'Updates one branch',
    type: Branch
  })
  async updateOne(@UserD() user, @Body() updateBranchDto: UpdateBranchDto): Promise<Branch> {
    const model = await this.branchesService.findOne(updateBranchDto.id);
    await this.validateCall(user, model.organizationId);

    const { id, ...data } = updateBranchDto;
    return this.branchesService.updateOne(id, data);
  }

  @Get(':id/files')
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
  async addFile(@Param("id") id, @UploadedFile() file): Promise<boolean> {
    this.filesService.uploadImagesFor('BRANCH', id, [file]);
    return true;
  }

  @Post(":id/remove-file")
  @ApiOkResponse({
    description: 'Remove file from list',
    type: Boolean
  })
  async removeFile(@Param("id") id): Promise<boolean> {
    this.filesService.remove(id);
    return true;
  }

  private async validateCall(user, id){
    const userEntity = await this.usersService.findOneWithOrganizations(user.id);

    if(!userEntity.organizations.some(org => org.id == id)) {
      throw new BadRequestException('Wrong input');
    }
  }
}
