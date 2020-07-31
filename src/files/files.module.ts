import { Module, Global } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { File } from './file.entity';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([File])],
  providers: [FilesService],
  exports: [FilesService],
  controllers: [FilesController],
})
export class FilesModule {}
