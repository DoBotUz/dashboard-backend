import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.entity';
import { hash as bcryptHash, compare as bcryptCompare } from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async createNew(data: any): Promise<User> {
    data.status = this.userModel.STATUSES.ACTIVE;
    data.password_hash = await this.hashPassword(data.password);
    return await this.userModel.create(data);
  }
  
  async findOne(id: number): Promise<User> {
    return await this.userModel.findOne({
      where: {
        id,
      },
    });
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({
      where: {
        email,
      },
    });
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword : string = await new Promise((resolve, reject) => {
      bcryptHash(password, saltRounds, function(err, hash) {
        if (err) reject(err)
        resolve(hash)
      });
    })
    return hashedPassword;
  }

  public async comparePasswords(password: string, hash: string): Promise<boolean> {
    const compareResult : boolean = await new Promise((resolve, reject) => {
      bcryptCompare(password, hash, function(err, res) {
        if (err) reject(err)
        resolve(res)
      });
    });
    return compareResult;
  }

  public async isEmailUnique(email: string, user_id?: number): Promise<boolean> {
    const user = await this.findOneByEmail(email);
    let userById = null;
    if (user_id) {
      userById = await this.findOne(user_id);
    }
    if(!user)
      return true;
    else {
      if(userById && user.email == userById.email)
        return true;
      else
        return false;
    }
  }

  async updateOne(id: number, data: any): Promise<User> {
    const model = await this.findOne(id);
    await model.update(data);
    return model;
  }
}
