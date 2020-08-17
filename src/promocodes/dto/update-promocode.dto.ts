import { BasePromocodeDto } from "./base-promocode.dto";
import { IsPromocodeExists } from "../validators/isPromocodeExists";
import { Validate, IsNotEmpty, IsNumber, IsIn } from "class-validator";
import { STATUSES } from '../promocode.entity';
import { Transform } from "class-transformer";

export class UpdatePromocodeDto extends BasePromocodeDto {
  @IsNotEmpty()
  @Validate(IsPromocodeExists)
  id: number;
}

export class UpdatePromocodeStatusDto {
  @IsNotEmpty()
  @Validate(IsPromocodeExists)
  id: number;

  @IsNotEmpty()
  @Transform((value) => {
    return Number(value)
  })
  @IsNumber()
  @IsIn(Object.values(STATUSES))
  status: number;
}