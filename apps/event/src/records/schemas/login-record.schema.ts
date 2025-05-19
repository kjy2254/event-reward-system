import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LoginRecordDocument = LoginRecord & Document;

// login_on_0505 보상 조건 검사 테스트용 임시 스키마
@Schema()
export class LoginRecord {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  date: Date;
}

export const LoginRecordSchema = SchemaFactory.createForClass(LoginRecord);
