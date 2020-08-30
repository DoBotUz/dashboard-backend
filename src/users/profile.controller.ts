import { Controller, Get, UseGuards, Post, Body, Param, UseInterceptors, UploadedFile, Delete } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserD } from 'src/auth/user.decorator';

import { UsersService } from './users.service';
import { UpdateUserDTO } from './dto';
import { User } from './user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/files/utils/file-upload.utils';
import { Feature } from '@nestjsx/crud';

@ApiTags('profile')
@Controller('profile')
@UseGuards(JwtAuthGuard)
@Feature('profile')
export class ProfileController {
  constructor(
    private usersService: UsersService,
  ) {}

  @Get('')
  @ApiOkResponse({
    description: 'Logged in user info',
    type: User
  })
  async profile(@UserD() user): Promise<any> {
    return this.usersService.findOne(user.id);
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
  async updateProfile(@UserD() user, @Body() data: UpdateUserDTO,  @UploadedFile() avatar): Promise<any> {
    if (avatar) {
      data.avatar = avatar.filename;
    }
    return this.usersService.updateOne(user.id, data);
  }

  @Delete('delete-avatar')
  @ApiOkResponse({
    description: 'Update user',
    type: User
  })
  async deleteAvatar(@UserD() user): Promise<any> {
    return this.usersService.updateOne(user.id, {
      avatar: '',
    });
  }

  @Get('isemailunique/:email')
  @ApiOkResponse({
    description: "Is email unique?",
    type: Boolean
  })
  async isEmailUnique(@UserD() user, @Param('email') email: string): Promise<boolean> {
    return await this.usersService.isEmailUnique(email, user.id);
  }
}
