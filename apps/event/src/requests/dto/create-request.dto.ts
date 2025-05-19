import { IsMongoId } from 'class-validator';

export class CreateRequestDto {
  @IsMongoId()
  eventId: string;
}
