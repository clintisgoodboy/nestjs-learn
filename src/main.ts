import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { RolesGuard } from './common/guard/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder() // 创建并配置文档信息
    .setTitle('标题')
    .setDescription('描述信息')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/swagger', app, document);

  await app.listen(3000, () => {
    console.log(
      `API：http://localhost:3000/api/ \nSwagger：http://localhost:3000/api/swagger`
    );
  });
}
bootstrap();
