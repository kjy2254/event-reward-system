import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuestRecordDocument = QuestRecord & Document;

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
