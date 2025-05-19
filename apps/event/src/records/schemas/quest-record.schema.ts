import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuestRecordDocument = QuestRecord & Document;

// destiny_quest_clear 보상 조건 검사 테스트용 임시 스키마
@Schema()
export class QuestRecord {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  questId: string;

  @Prop({ required: true })
  status: string; // ex: 'cleared'
}

export const QuestRecordSchema = SchemaFactory.createForClass(QuestRecord);
