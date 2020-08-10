import * as fs from 'fs';
import { Controller, UseGuards, Body, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
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

@Crud({
  model: {
    type: Organization
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
    private filesService: FilesService
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
  async createOne(@UserD() user, @Body() data: CreateOrganizationBranchBotDTO, @UploadedFiles() uploadedFiles): Promise<any> {
    if (uploadedFiles && uploadedFiles.thumbnail && typeof uploadedFiles.thumbnail[0] !== 'undefined') {
      const thumbnail = uploadedFiles.thumbnail[0];
      data.thumbnail = thumbnail.filename;
      fs.rename(thumbnail.path, `./uploads/organizations/${thumbnail.filename}`, (res) => {
        if (res !== null)
          console.log(res);
      });
    }
    const org = await this.organizationsService.createNew({
      user,
      ...data
    });
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
