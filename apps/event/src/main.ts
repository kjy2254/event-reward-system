import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EventModule } from './event.module';

async function bootstrap() {
  const app = await NestFactory.create(EventModule);

  // swagger 세팅
  const config = new DocumentBuilder()
    .setTitle('Event API')
    .setDescription('Event & Reward Management')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.port ?? 3000);
}
bootstrap();
