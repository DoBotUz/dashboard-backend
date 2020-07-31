import { ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { UsersService } from "../users.service";
import { Injectable } from "@nestjs/common";

@ValidatorConstraint({ name: "uniqueEmail", async: true })
@Injectable()
export class UniqueEmail implements ValidatorConstraintInterface {
    constructor(private usersService: UsersService) {}
    async validate(email: string): Promise<boolean> {
      if(!email)
        return false;
      const user = await this.usersService.findOneByEmail(email);
      return !user;
    }
    defaultMessage(): string {
        return "Email: ($value) is not unique";
    }
}