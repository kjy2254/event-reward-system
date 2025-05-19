import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  // swagger 세팅
  const config = new DocumentBuilder()
    .setTitle('Auth API')
    .setDescription('Authentication & Authorization')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs/auth', app, document);

  await app.listen(process.env.port ?? 3000);
}
bootstrap();
