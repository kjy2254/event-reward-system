import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRewardDto {
  @ApiProperty({ example: '극한 성장의 비약' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'ITEM' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: '3' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: '682acddd63ea6b534d274cb5' })
  @IsMongoId()
  eventId: string;
}
