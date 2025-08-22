import {
  Controller,
  UseGuards,
  Req,
  Get,
  Res,
  UnauthorizedException,
} from "@nestjs/common";
import { Response, Request } from "express";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { ROUTE_SEGMENTS, ENDPOINTS, CLIENT_ROUTES } from "@/_utils/router";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { JwtUser } from "./strategies/types";
import { UsersService } from "@/users/users.service";

const COOKIE_NAME = process.env.COOKIE_NAME ?? "finfix_token";

@ApiTags(ROUTE_SEGMENTS.AUTH)
@Controller(ROUTE_SEGMENTS.AUTH)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @Get(ENDPOINTS.AUTH.GOOGLE)
  @UseGuards(AuthGuard(ENDPOINTS.AUTH.GOOGLE))
  async googleAuth() {}

  @Get(ENDPOINTS.AUTH.GOOGLE_CALLBACK)
  @UseGuards(AuthGuard(ENDPOINTS.AUTH.GOOGLE))
  async googleAuthRedirect(@Req() req: any, @Res() res: Response) {
    try {
      const { access_token } = await this.authService.googleAuth(req.user);

      res.cookie(COOKIE_NAME, access_token, {
        httpOnly: true,
        sameSite: "lax", // в проде на разных доменах: 'none' + secure: true
        secure: false, // true под HTTPS
        maxAge: 7 * 24 * 3600 * 1000,
        path: "/",
      });

      return res.redirect(
        `${process.env.FRONTEND_URL}/${CLIENT_ROUTES.DASHBOARD}`
      );
    } catch (error) {
      const msg = error?.message ?? "Authentication failed";
      return res.redirect(
        `${process.env.FRONTEND_URL}/app/auth/callback?success=false&error=${encodeURIComponent(msg)}`
      );
    }
  }

  @Get(ENDPOINTS.AUTH.ME)
  @UseGuards(JwtAuthGuard)
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
}
