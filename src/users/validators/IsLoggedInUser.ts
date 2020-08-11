import { ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { Injectable } from "@nestjs/common";


@ValidatorConstraint({ name: "IsLoggedInUser", async: true })
@Injectable()
export class IsLoggedInUser implements ValidatorConstraintInterface {
    async validate(id: number, args): Promise<boolean> {
      console.log(args);
      return false;
      // if(!id || !this.user)
      //   return false;
      // console.log(this.user);
      // return this.user.id === id;
    }
    defaultMessage(): string {
        return "Wrong User";
    }
}