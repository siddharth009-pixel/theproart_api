import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('The ProArt')
    // .setDescription('Marvel Mock API')
    .setVersion('1.0')
    .build();

  app.enableCors({
    origin: '*',
    credentials: true,
    exposedHeaders: ['Authorization'],
  });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

process.on('uncaughtException',(err)=>{
  console.log(err);
})
process.on('unhandledRejection',(err)=>{
  console.log(err);
})
