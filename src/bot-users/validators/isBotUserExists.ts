import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { BotUsersService } from '../bot-users.service';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'isBotUserExists', async: true })
@Injectable()
export class IsBotUserExists implements ValidatorConstraintInterface {
    constructor(private model: BotUsersService) {}
    async validate(id: number): Promise<boolean> {
      if(!id)
        return false;
      const model = await this.model.findOne(id);
      return Boolean(model);
    }
    defaultMessage(): string {
        return 'BotUser does not exist';
    }
}