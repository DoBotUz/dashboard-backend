import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { User } from './user.entity';

@Injectable()
export class UsersCrudService extends TypeOrmCrudService<User> {
  constructor(
    @InjectRepository(User)
    public usersRepository: Repository<User>,
  ) {
    super(usersRepository)
  }
}
