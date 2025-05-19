import { IsArray, IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  conditions: string[];

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
