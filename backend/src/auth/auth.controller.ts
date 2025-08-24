import {
  Controller,
  UseGuards,
  Req,
  Get,
  Res,
  UnauthorizedException,
  Header,
  Post,
} from "@nestjs/common";
import { Response, Request } from "express";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { ROUTE_SEGMENTS, ENDPOINTS } from "@/shared/router";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { JwtUser } from "./strategies/types";
import { UsersService } from "@/users/users.service";
import { ConfigService } from "@nestjs/config";
import { cookieBaseFromEnv } from "./helpers/cookieBaseFromEnv";
import { randomBytes } from "crypto";
import { GoogleAuthGuard } from "./guards/google-auth-guard";

@ApiTags(ROUTE_SEGMENTS.AUTH)
@Controller(ROUTE_SEGMENTS.AUTH)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly cfg: ConfigService,
  ) {}

  @Get(ENDPOINTS.AUTH.GOOGLE)
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}

  @Get(ENDPOINTS.AUTH.GOOGLE_CALLBACK)
  @UseGuards(AuthGuard(ENDPOINTS.AUTH.GOOGLE))
  async googleAuthRedirect(@Req() req: any, @Res() res: Response) {
    const cookieState = req.cookies?.["oauth_state"];
    const queryState = req.query?.["state"];
    if (!cookieState || !queryState || cookieState !== queryState) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/app/auth/callback?success=false&error=${encodeURIComponent("bad state")}`,
      );
    }
    res.clearCookie("oauth_state", { path: "/" });
    try {
      const { access_token } = await this.authService.googleAuth(req.user);
      const COOKIE_NAME = this.cfg.get<string>("COOKIE_NAME") ?? "finfix_token";
      const csrf = randomBytes(32).toString("hex");
      const base = cookieBaseFromEnv(this.cfg);

      res.cookie(COOKIE_NAME, access_token, base);
      res.cookie("csrf", csrf, { ...base, httpOnly: false });

      return res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
    } catch (error) {
      const msg = error?.message ?? "Authentication failed";
      return res.redirect(
        `${process.env.FRONTEND_URL}/app/auth/callback?success=false&error=${encodeURIComponent(msg)}`,
      );
    }
  }

  @Get(ENDPOINTS.AUTH.ME)
  @UseGuards(JwtAuthGuard)
  @Header("Cache-Control", "no-store")
  async isAuthentificated(@Req() req: Request) {
    const jwtUser = req.user as JwtUser;
    if (!jwtUser?.sub) {
      throw new UnauthorizedException("Not authorized");
    }

    const user = await this.usersService.findById(jwtUser.sub);
    if (!user) throw new UnauthorizedException("Session is invalid");

    return {
      id: user.id,
      userName: user.userName,
      email: user.email,
      avatarUrl: user.avatarUrl,
    };
  }

  @Post(ENDPOINTS.AUTH.LOGOUT)
  @UseGuards(JwtAuthGuard)
  logout(@Req() req: Request, @Res() res: Response) {
    const name = this.cfg.get<string>("COOKIE_NAME") ?? "finfix_token";
    const base = cookieBaseFromEnv(this.cfg);
    res.clearCookie("csrf", { ...base, httpOnly: false });
    res.clearCookie(name, { ...base });
    return res.status(204).send();
  }

  @Get(ENDPOINTS.AUTH.CSRF)
  csrf(@Res() res: Response) {
    const csrf = randomBytes(32).toString("hex");
    const base = cookieBaseFromEnv(this.cfg);
    res.cookie("csrf", csrf, {
      ...base,
      httpOnly: false,
      maxAge: 50 * 60 * 1000,
    }); //5h
    return res.json({ csrf });
  }
}
