import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    // Enable CORS for frontend (including file:// protocol for testing)
    app.enableCors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, Postman, or file://)
        if (!origin) return callback(null, true);
        // Allow localhost origins and file:// protocol
        const allowedOrigins = [
          "http://localhost:5173",
          "http://localhost:3000",
          "http://127.0.0.1:5173",
          "http://127.0.0.1:3000",
          "null", // file:// protocol sends null origin
        ];
        if (allowedOrigins.includes(origin) || origin.startsWith("file://")) {
          callback(null, true);
        } else {
          callback(null, true); // Allow all for testing - change in production
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    });

    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      })
    );

    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 Backend server running on http://localhost:${port}`);
    console.log(`📡 API endpoints available at http://localhost:${port}/auth`);
  } catch (error) {
    console.error("❌ Error starting server:", error.message);
    if (error.message.includes("EADDRINUSE")) {
      console.error(
        "⚠️  Port 3001 is already in use. Please stop the other process or change PORT in .env"
      );
    } else if (
      error.message.includes("database") ||
      error.message.includes("Prisma")
    ) {
      console.error("⚠️  Database connection error. Please check:");
      console.error("   1. PostgreSQL is running");
      console.error("   2. DATABASE_URL in .env is correct");
      console.error('   3. Database "drizmo_db" exists');
    }
    process.exit(1);
  }
}
bootstrap();
