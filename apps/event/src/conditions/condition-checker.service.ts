import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  LoginRecord,
  LoginRecordDocument,
} from '../records/schemas/login-record.schema';
import {
  QuestRecord,
  QuestRecordDocument,
} from '../records/schemas/quest-record.schema';

@Injectable()
export class ConditionCheckerService {
  constructor(
    @InjectModel(LoginRecord.name)
    private readonly loginLogModel: Model<LoginRecordDocument>, // 로그인 기록
    @InjectModel(QuestRecord.name)
    private readonly questRecordModel: Model<QuestRecordDocument>, // 퀘스트 완료 기록
  ) {}

  // key → 검사 함수 매핑
  private readonly handlers: Record<
    string,
    (userId: string) => Promise<boolean>
  > = {
    login_on_0505: this.checkLoginOn0505,
    destiny_quest_clear: this.checkDestinyQuestClear,
  };

  async check(userId: string, key: string): Promise<boolean> {
    const handler = this.handlers[key];
    if (!handler) throw new Error(`조건 검사기가 정의되지 않았습니다: ${key}`);
    return handler.call(this, userId);
  }

  // 5월 5일에 로그인한 기록 확인 로직
  private async checkLoginOn0505(userId: string): Promise<boolean> {
    const start = new Date('2025-05-05T00:00:00.000Z');
    const end = new Date('2025-05-06T00:00:00.000Z');

    const login = await this.loginLogModel.findOne({
      userId,
      date: { $gte: start, $lt: end }, // ✅ 5월 5일 하루 전체 범위
    });

    return !!login;
  }

  // 데스티니 해방 퀘스트 클리어 여부 확인 로직
  private async checkDestinyQuestClear(userId: string): Promise<boolean> {
    const quest = await this.questRecordModel.findOne({
      userId,
      questId: 'destiny-final',
      status: 'cleared',
    });
    return !!quest;
  }
}
