import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';


@ValidatorConstraint({ name: 'IsAllowedBotUser', async: true })
@Injectable()
export class IsAllowedBotUser implements ValidatorConstraintInterface {
  private botUsersService;

  constructor(private readonly moduleRef: ModuleRef) {}
  async validate(id: number, args: ValidationArguments): Promise<boolean> {
    if (!this.botUsersService) {
      this.botUsersService = this.moduleRef.get('BotUsersService');
    }
    if(!id)
      return false;

    const botUser = await this.botUsersService.findOneWithBot(id);

    if(!botUser || botUser.organizationId !== args.constraints[0])
      return false;
  }
  defaultMessage(): string {
    return 'This Branch is not allowed';
  }
}