import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In } from 'typeorm';
import { User, STATUSES } from './user.entity';
import { STATUSES as NOTIFICATION_STATUSES } from 'src/notifications/notification.entity';
import { hash as bcryptHash, compare as bcryptCompare } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createNew(data: any): Promise<User> {
    data.status = STATUSES.ACTIVE;
    data.password_hash = await this.hashPassword(data.password);
    const user = new User();
    Object.assign(user, data);
    return await this.usersRepository.save(user);
  }
  
  async findOne(id: number): Promise<User> {
    return await this.usersRepository.createQueryBuilder("user").where("user.id = :id", { id }).leftJoinAndSelect("user.notifications", "notification", "notification.status != :status", { status: NOTIFICATION_STATUSES.READ }).leftJoinAndSelect("user.organizations", "organizations").leftJoinAndSelect("organizations.bot", "bot")
    .getOne();
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: {
        email,
      },
      join: {
        alias: 'user',
        leftJoinAndSelect: {
          organizations: 'user.organizations'
        }
      }
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
    Object.assign(model, data);
    await this.usersRepository.save(model);
    return model;
  }

  async findOneWithOrganizations(id: number): Promise<User> {
    return this.usersRepository.findOne({
      where: {
        id: id
      },
      join: {
        alias: 'user',
        leftJoinAndSelect: {
          organizations: 'user.organizations'
        }
      }
    })
  }

  async findOneWithBots(id: number): Promise<User> {
    return this.usersRepository.findOne({
      where: {
        id: id
      },
      join: {
        alias: 'user',
        leftJoinAndSelect: {
          organizations: 'user.organizations',
          bot: 'organizations.bot',
        }
      }
    })
  }

  async findUsersOfOrganization(org_id: number): Promise<User[]> {
    return this.usersRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.organizations', 'organization')
      .where('organization.id = :id', {id: org_id})
      .getMany();
    return this.usersRepository.find({
      join: {
        alias: 'user',
        leftJoinAndSelect: {
          organizations: 'user.organizations'
        }
      },
      where: {
        ['user.organizations']: {
          id: In([org_id])
        }
      }
    })
  }
  
}
