import { ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { Injectable } from "@nestjs/common";
import { BotsService } from "../bots.service";

@ValidatorConstraint({ name: "uniqueEmail", async: true })
@Injectable()
export class UniqueBotToken implements ValidatorConstraintInterface {
    constructor(private botsService: BotsService) {}
    async validate(token: string): Promise<boolean> {
      if(!token)
        return false;
      const bot = await this.botsService.findOneByToken(token);
      return !bot;
    }
    defaultMessage(): string {
        return "BotToken: ($value) is not unique";
    }
}