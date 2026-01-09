import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Tự động kiểm tra dữ liệu đầu vào (DTO)
  app.useGlobalPipes(new ValidationPipe());
  
  // CẬP NHẬT: Cấu hình CORS mở rộng để tránh lỗi kết nối từ Frontend
  app.enableCors({
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // CẬP NHẬT: Dùng PORT của môi trường (cho Render) hoặc 4000 (cho Local)
  await app.listen(process.env.PORT || 4000);
}
bootstrap();