import { IsNotEmpty, IsOptional, Length, Validate, IsNumber, IsJSON, IsString, IsBoolean } from 'class-validator';
import { IsOrganizationExists } from 'src/organizations/validators';

export class BaseBranchDto {
  @IsNotEmpty()
  @Validate(IsOrganizationExists)
  organizationId: number;

  @IsNotEmpty()
  @IsString()
  @Length(3, 255)
  ru_title: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 255)
  uz_title: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 255)
  en_title: string;

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
  @IsBoolean()
  is_all_day: boolean;

  @IsOptional()
  @IsNumber()
  tg_group_id: number;
}