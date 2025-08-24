import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  NotFoundException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get user by ID" })
  @ApiResponse({ status: 200, description: "User found" })
  @ApiResponse({ status: 404, description: "User not found" })
  async findById(@Param("id") id: string): Promise<User> {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }
}
