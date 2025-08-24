import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UsersModule } from "../users/users.module";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { GoogleStrategy } from "./strategies/google.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { CategoriesModule } from "@/categories/categories.module";

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ session: false }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (cfg: ConfigService) => ({
        secret: cfg.get<string>("APP_JWT_SECRET"),
        signOptions: {
          expiresIn: cfg.get<string>("APP_JWT_EXPIRES_IN", "7d"),
        },
      }),
    }),
    UsersModule,
    CategoriesModule,
  ],
  providers: [AuthService, GoogleStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
