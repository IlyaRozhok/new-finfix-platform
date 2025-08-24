import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class CsrfInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler) {
    const req = ctx.switchToHttp().getRequest<Request>();

    const url = req.url;

    if (url.startsWith("/api/docs") || url.startsWith("/api-json")) {
      return next.handle();
    }

    if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next.handle();

    const tokenHeader = req.header("x-csrf-token");
    const tokenCookie = req.cookies?.["csrf"];

    if (!tokenHeader || !tokenCookie || tokenHeader !== tokenCookie) {
      throw new ForbiddenException("Bad CSRF token");
    }
    return next.handle();
  }
}
