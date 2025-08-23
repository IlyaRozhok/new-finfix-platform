import { User } from "@/users/user.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";

export enum DebtType {
  LOAN = "loan",
  CREDIT_CARD = "credit_card",
}

@Entity("debts")
@Index("idx_debts_user_active", ["userId"], { where: '"is_closed" = false' })
export class Debt {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "user_id", type: "uuid" })
  userId: string;

  @ManyToOne(() => User, (u) => u.debts, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ type: "text" })
  description: string;

  @Column({
    name: "debt_type",
    type: "enum",
    enum: DebtType,
    enumName: "debt_type",
  })
  debtType: DebtType;

  @Column({ name: "total_debt", type: "numeric", precision: 14, scale: 2 })
  totalDebt: string; // для loan — начальный principal (для карты может быть 0)

  @Column({
    name: "monthly_payment",
    type: "numeric",
    precision: 14,
    scale: 2,
    nullable: true,
  })
  monthlyPayment?: string | null; // если фикс платёж известен (loan)

  @Column({
    name: "interest_rate_monthly",
    type: "numeric",
    precision: 6,
    scale: 3,
    nullable: true,
  })
  interestRateMonthly?: string | null; // например 0.037 для 3.7%/мес

  @Column({ name: "grace_period_days", type: "int", nullable: true })
  gracePeriodDays?: number | null; // например 62 для карты

  @Index()
  @Column({ name: "start_date", type: "date" })
  startDate: string;

  @Column({ name: "statement_day", type: "smallint", nullable: true })
  statementDay?: number | null;

  @Column({ name: "due_day", type: "smallint", nullable: true })
  dueDay?: number | null;

  @Column({ name: "is_closed", type: "boolean", default: false })
  isClosed: boolean;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date;
}
