import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { CategoriesModule } from "./categories/categories.module";
import { DebtsModule } from "./debts/debts.module";
import { RecurringExpensesModule } from "./recurring-expenses/recurring-expenses.module";
import { RecurringIncomesModule } from "./recurring-incomes/recurring-incomes.module";
import { InstallmentsModule } from "./installments/installments.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: "localhost",
        port: parseInt(configService.get<string>("POSTGRES_PORT")),
        username: configService.get<string>("POSTGRES_USER"),
        password: configService.get<string>("POSTGRES_PASSWORD"),
        database: configService.get<string>("POSTGRES_DB"),
        entities: [__dirname + "/**/*.entity{.ts,.js}"],
        // synchronize: configService.get<string>("NODE_ENV") === "development",
        synchronize: false,
        autoLoadEntities: true,
      }),
    }),
    AuthModule,
    UsersModule,
    CategoriesModule,
    DebtsModule,

    RecurringExpensesModule,
    RecurringIncomesModule,
    InstallmentsModule,
  ],
})
export class AppModule {}
