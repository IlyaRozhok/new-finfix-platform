import { User } from "@/users/user.entity";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { GooglePayload } from "./types";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(cfg: ConfigService) {
    super({
      clientID: cfg.get<string>("GOOGLE_CLIENT_ID"),
      clientSecret: cfg.get<string>("GOOGLE_CLIENT_SECRET"),
      callbackURL: cfg.get<string>("GOOGLE_CALLBACK_URL"),
      scope: ["email", "profile"],
    });
  }

  async validate(
    _: string,
    __: string,
    profile: Profile
  ): Promise<GooglePayload> {
    const email = profile.emails?.[0]?.value;
    const avatarUrl = profile.photos?.[0]?.value ?? null;
    const userName =
      profile.displayName ??
      profile.name?.givenName ??
      (email ? email.split("@")[0] : "User");

    return {
      googleSub: profile.id,
      email,
      userName,
      avatarUrl,
    };
  }
}
