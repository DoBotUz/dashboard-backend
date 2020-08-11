import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File, KEYS, TYPES } from './file.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private filesRepository: Repository<File>,
  ) {}
  
  async uploadImagesFor(key: string, key_id: number, files: any[]): Promise<void> {
    for (let i = 0; i < files.length; i += 1) {
      fs.rename(files[i].path, `./uploads/files/${files[i].filename}`, (res) => {
        if (res !== null)
          console.log(res);
      });
      const newFile = {
        key: KEYS[key],
        key_id: key_id,
        file: files[i].filename,
        original_name: files[i].originalname,
        size: files[i].size,
        mime: files[i].mimetype,
        type: TYPES.IMAGE,
      };
      const model = new File();
      Object.assign(model, newFile);
      this.filesRepository.insert(model);
    }
  }

  async removeImageFor(key: string, key_id: number): Promise<void> {
    const model = await this.filesRepository.findOne({
      where: {
        key: KEYS[key],
        key_id
      }
    });
    this.filesRepository.remove(model);
  }

  async remove(id: number): Promise<void> {
    const model = await this.filesRepository.findOne(id);
    this.filesRepository.remove(model);
  }
}