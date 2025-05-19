import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RewardRequestDocument = RewardRequest & Document;

@Schema({ timestamps: true })
export class RewardRequest {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  eventId: string;

  @Prop({ required: true })
  status:
    | 'REWARDED'
    | 'CONDITION_NOT_MET'
    | 'ALREADY_REWARDED'
    | 'EVENT_NOT_ACTIVE';
}

export const RequestSchema = SchemaFactory.createForClass(RewardRequest);
