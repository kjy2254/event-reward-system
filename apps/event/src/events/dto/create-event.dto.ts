import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateEventDto {
  @ApiProperty({ example: '어린이날 접속 이벤트' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: '5월 5일 어린이날 접속시 극성비 증정' })
  @IsString()
  description: string;

  @ApiProperty({ example: ['login_on_0505'] })
  @IsArray()
  @IsString({ each: true })
  conditions: string[];

  @ApiProperty({ example: '2025-05-05T00:00:00.000Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2025-05-05T23:59:59.000Z' })
  @IsDateString()
  endDate: string;
}
