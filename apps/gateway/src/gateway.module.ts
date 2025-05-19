import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { GatewayController } from './gateway.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { SwaggerProxyController } from './swagget.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret-key',
      signOptions: { expiresIn: '1h' },
    }),
    HttpModule,
  ],
  controllers: [GatewayController, SwaggerProxyController],
  providers: [JwtStrategy],
})
export class GatewayModule {}
