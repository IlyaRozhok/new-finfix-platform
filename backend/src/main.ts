import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import helmet from "helmet";
import { CsrfInterceptor } from "./common/csrf.inerceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.use(cookieParser());
  app.setGlobalPrefix("api");
  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new CsrfInterceptor());

  const config = new DocumentBuilder()
    .setTitle("FinFix API")
    .setDescription("Financial Management Platform API")
    .setVersion("1.0")
    .addApiKey({ type: "apiKey", in: "header", name: "x-csrf-token" }, "csrf")
    .build();

  const apiDocument = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("api/docs", app, apiDocument, {
    swaggerOptions: {
      persistAuthorization: true,
      requestInterceptor: (req: any) => {
        const getCookie = (name: string) => {
          const doc = (globalThis as any).document as Document | undefined;
          if (!doc?.cookie) return null;
          const m = doc.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
          return m ? decodeURIComponent(m[2]) : null;
        };

        const setHeader = (token: string) => {
          if (!req.headers) req.headers = {};
          if (!req.headers["x-csrf-token"]) {
            req.headers["x-csrf-token"] = token;
          }
          return req;
        };

        let token = getCookie("csrf");
        if (token) return setHeader(token);

        return fetch("/api/auth/csrf", { credentials: "include" })
          .then((r) => r.json())
          .then((data) => setHeader(data.csrf));
      },
    },
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`FinFix API is running on: http://localhost:${port}`);
  console.log(`Swagger: http://localhost:${port}/api/docs`);
}

bootstrap();
