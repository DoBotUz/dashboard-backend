import * as fs from 'fs';
import { Controller, UseGuards, Body, UseInterceptors, UploadedFile, UploadedFiles, ValidationPipe, UsePipes, BadRequestException, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Crud, CrudController, Override, CrudAuth } from "@nestjsx/crud";
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserD } from 'src/auth/user.decorator';
import { FileInterceptor, FileFieldsInterceptor } from "@nestjs/platform-express";
import { diskStorage } from 'multer';
import { OrganizationsService } from './organizations.service';
import { OrgCrudService } from './org-crud.service';
import { CreateOrganizationBranchBotDTO, UpdateOrganizationDTO, SwitchBotStatusDto } from './dto';
import { BranchesService } from 'src/branches/branches.service';
import { BotsService } from 'src/bots/bots.service';
import { BotsGateway } from 'src/gateways/bots/bots.gateway';
import { Organization, STATUSES } from './organization.entity';
import { editFileName, imageFileFilter } from 'src/files/utils/file-upload.utils';
import { FilesService } from 'src/files/files.service';
import { File, KEYS as FILE_KEYS } from 'src/files/file.entity';
import { User } from 'src/users/user.entity';
import { ValidationError } from 'class-validator';
import { ValidationException } from 'src/validation-exception';
import { UsersService } from 'src/users/users.service';


@Crud({
  model: {
    type: Organization
  },
  routes: {
    only: ['getManyBase', 'getOneBase', 'createOneBase', 'deleteOneBase'],
  },
  query: {
    join: {
      branches: {
        eager: true,
      },
      user: {
        eager: true,
      },
      bot: {
        eager: true,
      },
    },
    filter: {
      status: {
        $ne: STATUSES.DELETED,
      }
    }
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
    console.log(data);
    data.userId = user.id;
    const org = await this.organizationsService.createNew(data);
    if (uploadedFiles && uploadedFiles.files && uploadedFiles.files.length) {
      this.filesService.uploadImagesFor(FILE_KEYS.ORGANIZATION, org.id, uploadedFiles.files);
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

  @Post("/update")
  @ApiOkResponse({
    description: 'Updates one organization',
    type: Organization
  })
  @UseInterceptors(FileInterceptor('thumbnail', {
    storage: diskStorage({
      destination: 'uploads/organizations/',
      filename: editFileName,
    }),
    fileFilter: imageFileFilter,
  }))
  async updateOne(@UserD() user, @Body() updateOrganizationDTO: UpdateOrganizationDTO, @UploadedFile() thumbnail): Promise<any> {
    const { id, bot, ...data } = updateOrganizationDTO;
    await this.validateCall(user, id);

    if (thumbnail) {
      data.thumbnail = thumbnail.filename;
    }
    
    const model = await this.organizationsService.updateOne(id, data);
    const bot_id = bot.id;
    delete bot.id;
    this.botsService.updateOne(bot_id, bot);
    model.bot.token = bot.token;
    return model;
  }

  @Get(':id/files')
  async getFiles(@UserD() user, @Param('id') id): Promise<File[]> {
    await this.validateCall(user, id);
    return this.filesService.findFilesByKeyAndId(FILE_KEYS.ORGANIZATION, id);
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
    this.filesService.uploadImagesFor(FILE_KEYS.ORGANIZATION, id, [file]);
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

  @Post("/switch-bot-status")
  @ApiOkResponse({
    description: 'Changes organiaztion related bot status',
    type: Boolean
  })
  async switchBotStatus(@UserD() user, @Body() data: SwitchBotStatusDto): Promise<boolean> {
    await this.validateCall(user, data.id);
    const bot = await this.botsService.findOnyByOrgId(data.id);
    bot.status = data.status;
    await this.botsService.updateOneModel(bot);
    this.botsGateway.botStatusChange({
      id: bot.id,
      status: bot.status,
    });
    return true;
  }

  private async validateCall(user: User, id: number){
    const userEntity = await this.usersService.findOneWithOrganizations(user.id);

    if(!userEntity.organizations.some(org => org.id == id)) {
      throw new BadRequestException('Wrong input');
    }
  }
}
