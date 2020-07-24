import { IsNotEmpty, IsOptional, IsIn } from "class-validator";

export class UsersPaginationDto{
  @IsNotEmpty()
  page: number;
  
  @IsNotEmpty()
  limit: number;

  @IsOptional()
  search: string;

  @IsOptional()
  @IsIn(["0","10","20"])
  status: number;
}