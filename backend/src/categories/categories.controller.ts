import { Controller, Get, UseGuards, Query } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ROUTE_SEGMENTS, ENDPOINTS } from "../shared/router";

@UseGuards(JwtAuthGuard)
@Controller(ROUTE_SEGMENTS.CATEGORIES)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get(ENDPOINTS.CATEGORIES.ONBOARDING)
  async findOnboardingCategories(@Query("uid") uid: string) {
    return this.categoriesService.findOnboardingCategories(uid);
  }
}
