import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category, CategoryKind } from "./category.entity";
import { Repository } from "typeorm";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async seedDefaults(userId: string) {
    const exists = await this.categoryRepository.count({ where: { userId } });
    if (exists) return;

    const categories: Array<Partial<Category>> = [
      //Expenses
      { userId, kind: CategoryKind.EXPENSE, name: "House", isSystem: true },
      {
        userId,
        kind: CategoryKind.EXPENSE,
        name: "Food & Drinks",
        isSystem: true,
      },
      { userId, kind: CategoryKind.EXPENSE, name: "Transport", isSystem: true },
      {
        userId,
        kind: CategoryKind.EXPENSE,
        name: "Restaurant",
        isSystem: true,
      },
      {
        userId,
        kind: CategoryKind.EXPENSE,
        name: "Coffee or snacks",
        isSystem: true,
      },
      { userId, kind: CategoryKind.EXPENSE, name: "Sport", isSystem: true },
      { userId, kind: CategoryKind.EXPENSE, name: "Health", isSystem: true },
      {
        userId,
        kind: CategoryKind.EXPENSE,
        name: "Personal Care",
        isSystem: true,
      },
      { userId, kind: CategoryKind.EXPENSE, name: "Cinema", isSystem: true },
      { userId, kind: CategoryKind.EXPENSE, name: "Gifts", isSystem: true },
      {
        userId,
        kind: CategoryKind.EXPENSE,
        name: "Telecommunication",
        isSystem: true,
      },
      {
        userId,
        kind: CategoryKind.EXPENSE,
        name: "Emergency fund",
        isSystem: true,
      },
      { userId, kind: CategoryKind.EXPENSE, name: "Family", isSystem: true },

      //Incomes
      { userId, kind: CategoryKind.INCOME, name: "Salary", isSystem: true },
      { userId, kind: CategoryKind.INCOME, name: "Freelance", isSystem: true },
    ];

    await this.categoryRepository.save(categories);
  }

  async findOnboardingCategories(uid: string) {
    return await this.categoryRepository.find({
      select: { id: true, name: true },
      where: {
        kind: CategoryKind.EXPENSE,
        userId: uid,
      },
      order: {
        name: "ASC",
      },
    });
  }
}
