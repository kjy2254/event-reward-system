import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LoginRecordDocument = LoginRecord & Document;

@Schema()
export class LoginRecord {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  date: Date;
}

export const LoginRecordSchema = SchemaFactory.createForClass(LoginRecord);
