import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { File } from './file.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(File)
    private fileModel: typeof File,
  ) {}
  
  async uploadImagesFor(key: string, key_id: number, files: any[]): Promise<void> {
    for (let i = 0; i < files.length; i += 1) {
      fs.rename(files[i].path, `./uploads/files/${files[i].filename}`, (res) => {
        if (res !== null)
          console.log(res);
      });
      const newFile = {
        key: File.KEYS[key],
        key_id: key_id,
        file: files[i].filename,
        original_name: files[i].originalname,
        size: files[i].size,
        mime: files[i].mimetype,
        type: File.TYPES.IMAGE,
      };
      this.fileModel.create(newFile);
    }
  }

  async removeImageFor(key: string, key_id: number): Promise<void> {
    this.fileModel.destroy({
      where: {
        key: File.KEYS[key],
        key_id
      }
    });
  }

  async remove(id: number): Promise<void> {
    this.fileModel.destroy({
      where: {
        id
      }
    });
  }
}