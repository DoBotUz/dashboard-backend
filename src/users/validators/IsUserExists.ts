import { ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { UsersService } from "../users.service";
import { Injectable } from "@nestjs/common";

@ValidatorConstraint({ name: "isUserExist", async: true })
@Injectable()
export class IsUserExists implements ValidatorConstraintInterface {

    constructor(private usersService: UsersService) {}

    async validate(id: number): Promise<boolean> {
      if(!id)
        return false;
      
      const user = await this.usersService.findOne(id);
      
      return Boolean(user);
    }

    defaultMessage(): string {
        return "User does not exist";
    }
}