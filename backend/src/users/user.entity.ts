import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from "typeorm";
import { Transaction } from "../transactions/transaction.entity";
import { Debt } from "../debts/debt.entity";
import { MonthlySummary } from "../statistics/monthly-summary.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ name: "user_name", length: 150 })
  userName: string;

  @Column({ name: "google_sub", unique: true, type: "text" })
  googleSub: string;

  @Column({ name: "avatar_url", type: "text", nullable: true })
  avatarUrl: string | null;

  @OneToMany(() => Transaction, (t) => t.user) transactions: Transaction[];
  @OneToMany(() => Debt, (d) => d.user) debts: Debt[];
  @OneToMany(() => MonthlySummary, (s) => s.user)
  monthlySummaries: MonthlySummary[];

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date;
}
