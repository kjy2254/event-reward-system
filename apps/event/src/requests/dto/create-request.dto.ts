import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class CreateRequestDto {
  @ApiProperty({ example: '682acddd63ea6b534d274cb5' })
  @IsMongoId()
  eventId: string;
}
