import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { BotUsersService } from '../bot-users.service';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'isBotExist', async: true })
@Injectable()
export class IsBotUserExists implements ValidatorConstraintInterface {
    constructor(private botUsers: BotUsersService) {}
    async validate(id: number): Promise<boolean> {
      if(!id)
        return false;
      const bot = await this.botUsers.findOne(id);
      return Boolean(bot);
    }
    defaultMessage(): string {
        return 'Bot does not exist';
    }
}