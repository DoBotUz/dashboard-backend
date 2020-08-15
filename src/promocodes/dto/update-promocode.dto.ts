import { BasePromocodeDto } from "./base-promocode.dto";
import { IsPromocodeExists } from "../validators/isPromocodeExists";
import { Validate, IsNotEmpty } from "class-validator";

export class UpdatePromocodeDto extends BasePromocodeDto {
  @IsNotEmpty()
  @Validate(IsPromocodeExists)
  id: number;
}