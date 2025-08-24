import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { GooglePayload } from "./strategies/types";
import { CategoriesService } from "@/categories/categories.service";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private categoriesService: CategoriesService
  ) {}

  async googleAuth(googleUser: GooglePayload) {
    if (!googleUser.googleSub || !googleUser.email) {
      throw new UnauthorizedException("Invalid Google user");
    }

    const user = await this.usersService.upsertFromGoogle(googleUser);
    await this.categoriesService.seedDefaults(user.id);
    const token = this.jwtService.sign({ sub: user.id, email: user.email });

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        userName: user.userName,
        avatarUrl: user.avatarUrl,
      },
    };
  }
}
