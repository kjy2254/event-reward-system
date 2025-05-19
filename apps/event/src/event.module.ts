import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConditionsModule } from './conditions/conditions.module';
import { EventsModule } from './events/events.module';
import { RequestsModule } from './requests/requests.module';
import { RewardsModule } from './rewards/rewards.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    EventsModule,
    RewardsModule,
    RequestsModule,
    ConditionsModule,
  ],
})
export class EventModule {}
