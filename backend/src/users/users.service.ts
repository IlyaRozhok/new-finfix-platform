import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { GooglePayload } from "@/auth/strategies/types";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findByGoogleSub(googleSub: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { googleSub } });
  }

  async upsertFromGoogle(profile: GooglePayload): Promise<User> {
    let user = await this.findByGoogleSub(profile.googleSub);
    if (!user && profile.email) {
      user = await this.findByEmail(profile.email);
    }
    if (!user) {
      user = this.usersRepository.create({
        email: profile.email,
        userName: profile.userName,
        googleSub: profile.googleSub,
        avatarUrl: profile.avatarUrl,
      });
    } else {
      user.googleSub = profile.googleSub;
      user.userName = profile.userName ?? user.userName;
      user.avatarUrl = profile.avatarUrl ?? user.avatarUrl;
      if (profile.email) user.email = profile.email;
    }

    return this.usersRepository.save(user);
  }
}
