import { ENVIROMENT } from "@/shared/enums";
import { ConfigService } from "@nestjs/config";
import * as ms from "ms";

export const cookieBaseFromEnv = (cfg: ConfigService) => {
  const isProd = cfg.get("NODE_ENV") === ENVIROMENT.PROD;
  const crossSite = cfg.get("CROSS_SITE") === "true";
  const jwtExp = cfg.get<string>("APP_JWT_EXPIRES_IN") ?? "7d";
  const parsed =
    typeof jwtExp === "string" ? (ms as any)(jwtExp) : Number(jwtExp);
  const maxAge = Number.isFinite(parsed) ? parsed : 7 * 24 * 3600 * 1000;

  return {
    httpOnly: true,
    secure: isProd,
    sameSite: crossSite ? ("none" as const) : ("lax" as const),
    path: "/",
    maxAge,
    domain: cfg.get<string>("COOKIE_DOMAIN") || undefined,
  };
};
