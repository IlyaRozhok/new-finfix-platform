import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { User } from "@/users/user.entity";
import { GooglePayload } from "./strategies/types";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async googleAuth(googleUser: GooglePayload) {
    if (!googleUser.googleSub || !googleUser.email) {
      throw new UnauthorizedException("Invalid Google user");
    }

    const user = await this.usersService.upsertFromGoogle(googleUser);
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
