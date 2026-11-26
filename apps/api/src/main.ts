import "reflect-metadata";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { NestFactory } from "@nestjs/core";
import dotenv from "dotenv";
import { AppModule } from "./app.module";

const packageEnv = resolve(process.cwd(), ".env");
dotenv.config({ path: existsSync(packageEnv) ? packageEnv : resolve(process.cwd(), "../../.env") });

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.setGlobalPrefix("api");
  app.enableCors({
    origin: process.env.APP_URL ? [process.env.APP_URL] : false,
    credentials: true,
  });
  const port = Number(process.env.API_PORT || 3001);
  await app.listen(port, "0.0.0.0");
  console.log(`Sirius Cloud API (NestJS) listening on ${port}`);
}

void bootstrap();
