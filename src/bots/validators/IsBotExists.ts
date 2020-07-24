import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { BotsService } from '../bots.service';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'isBotExist', async: true })
@Injectable()
export class IsBotExists implements ValidatorConstraintInterface {

    constructor(private botsService: BotsService) {}

    async validate(id: number): Promise<boolean> {
      if(!id)
        return false;
      
      const bot = await this.botsService.findOne(id);
      
      return Boolean(bot);
    }

    defaultMessage(): string {
        return 'Bot does not exist';
    }
}