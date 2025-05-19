import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConditionDefinitionDocument = ConditionDefinition & Document;

@Schema({ collection: 'conditions' })
export class ConditionDefinition {
  @Prop({ required: true, unique: true })
  key: string; // ex) 'login_on_0505'

  @Prop({ required: true })
  description: string; // ex) '5월 5일 로그인 여부'
}

export const ConditionDefinitionSchema =
  SchemaFactory.createForClass(ConditionDefinition);
