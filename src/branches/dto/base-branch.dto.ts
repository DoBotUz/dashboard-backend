import { IsNotEmpty, IsOptional, Length, Validate, IsNumber, IsJSON } from 'class-validator';
import { IsOrganizationExists } from 'src/organizations/validators';

export class BaseBranchDTO {
  @IsNotEmpty()
  @Validate(IsOrganizationExists)
  organization_id: number;

  @IsNotEmpty()
  @Length(3, 255)
  title: string;

  @IsNotEmpty()
  @IsNumber()
  lat: number;

  @IsNotEmpty()
  @IsNumber()
  lng: number;

  @IsOptional()
  @IsJSON()
  timetable: string;

  @IsOptional()
  @IsNumber()
  is_all_day: number;
}