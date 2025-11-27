import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    
    // Enable CORS for frontend
    app.enableCors({
      origin: ['http://localhost:5173', 'http://localhost:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    // Global validation pipe
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }));

    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 Backend server running on http://localhost:${port}`);
    console.log(`📡 API endpoints available at http://localhost:${port}/auth`);
  } catch (error) {
    console.error('❌ Error starting server:', error.message);
    if (error.message.includes('EADDRINUSE')) {
      console.error('⚠️  Port 3001 is already in use. Please stop the other process or change PORT in .env');
    } else if (error.message.includes('database') || error.message.includes('Prisma')) {
      console.error('⚠️  Database connection error. Please check:');
      console.error('   1. PostgreSQL is running');
      console.error('   2. DATABASE_URL in .env is correct');
      console.error('   3. Database "drizmo_db" exists');
    }
    process.exit(1);
  }
}
bootstrap();

