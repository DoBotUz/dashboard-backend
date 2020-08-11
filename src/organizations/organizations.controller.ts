import * as fs from 'fs';
import { Controller, UseGuards, Body, UseInterceptors, UploadedFile, UploadedFiles, ValidationPipe, UsePipes, BadRequestException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, Override, CrudAuth } from "@nestjsx/crud";
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserD } from 'src/auth/user.decorator';
import { FileInterceptor, FileFieldsInterceptor } from "@nestjs/platform-express";
import { diskStorage } from 'multer';
import { OrganizationsService } from './organizations.service';
import { OrgCrudService } from './org-crud.service';
import { CreateOrganizationBranchBotDTO, UpdateOrganizationDTO } from './dto';
import { BranchesService } from 'src/branches/branches.service';
import { BotsService } from 'src/bots/bots.service';
import { BotsGateway } from 'src/gateways/bots/bots.gateway';
import { Organization } from './organization.entity';
import { editFileName, imageFileFilter } from 'src/files/utils/file-upload.utils';
import { FilesService } from 'src/files/files.service';
import { User } from 'src/users/user.entity';
import { ValidationError } from 'class-validator';
import { ValidationException } from 'src/validation-exception';
import { UsersService } from 'src/users/users.service';

@Crud({
  model: {
    type: Organization
  },
  routes: {
    only: ['getManyBase', 'getOneBase', 'updateOneBase', 'createOneBase'],
  },
  query: {
    join: {
      branches: {
        eager: true,
      },
      user: {
        eager: true,
      }
    },
  },
})
@CrudAuth({
  property: 'user',
  filter: (user: User) => ({
    'user.id': user.id,
  })
})
@ApiTags('organizations')
@Controller('organizations')
@UseGuards(JwtAuthGuard)
export class OrganizationsController  implements CrudController<Organization> {
  constructor(
    public service: OrgCrudService,
    private organizationsService: OrganizationsService,
    private branchesService: BranchesService,
    private botsService: BotsService,
    private botsGateway: BotsGateway,
    private filesService: FilesService,
    private usersService: UsersService,
  ) {}
  
  @Override()
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
  @UsePipes(new ValidationPipe(
    {
      transform: true,
      whitelist: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
         return new ValidationException(validationErrors);
       }
    }
  ))
  async createOne(@UserD() user, @Body() data: CreateOrganizationBranchBotDTO, @UploadedFiles() uploadedFiles): Promise<any> {
    if (uploadedFiles && uploadedFiles.thumbnail && typeof uploadedFiles.thumbnail[0] !== 'undefined') {
      const thumbnail = uploadedFiles.thumbnail[0];
      data.thumbnail = thumbnail.filename;
      fs.rename(thumbnail.path, `./uploads/organizations/${thumbnail.filename}`, (res) => {
        if (res !== null)
          console.log(res);
      });
    }
    data.userId = user.id;
    const org = await this.organizationsService.createNew(data);
    if (uploadedFiles && uploadedFiles.files && uploadedFiles.files.length) {
      this.filesService.uploadImagesFor('ORGANIZATION', org.id, uploadedFiles.files);
    }
    const bot = await this.botsService.createNew({
      organization: org,
      ...data.bot,
    });
    this.botsGateway.newBot(bot.id);
    return {
      organization: org,
      bot,
    };
  }

  @Override()
  @UseInterceptors(FileInterceptor('thumbnail', {
    storage: diskStorage({
      destination: 'uploads/organizations/',
      filename: editFileName,
    }),
    fileFilter: imageFileFilter,
  }))
  async updateOne(@UserD() user, @Body() updateOrganizationDTO: UpdateOrganizationDTO, @UploadedFile() thumbnail): Promise<any> {
    const { id, ...data } = updateOrganizationDTO;
    const userEntity = await this.usersService.findOneWithOrganizations(user.id);

    if(!userEntity.organizations.some(org => org.id == id)) {
      throw new BadRequestException('Wrong input');
    }

    if (thumbnail) {
      data.thumbnail = thumbnail.filename;
    }
    const model = await this.organizationsService.updateOne(id, data);
    const bot_id = data.bot.id;
    delete data.bot.id;
    this.botsService.updateOne(bot_id, data.bot);
    return model;
  }
}
