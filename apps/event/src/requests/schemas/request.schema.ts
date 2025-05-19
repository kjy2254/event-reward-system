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
    | 'REWARDED' // 보상 지급 기록
    | 'CONDITION_NOT_MET' // 보상 조건 미달성
    | 'ALREADY_REWARDED' // 중복 보상 요청
    | 'EVENT_NOT_ACTIVE'; // 이벤트 비활성화 상태시 요청
}

export const RequestSchema = SchemaFactory.createForClass(RewardRequest);
