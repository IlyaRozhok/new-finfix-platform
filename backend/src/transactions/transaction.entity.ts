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
import { Category } from "../categories/category.entity";
import { Installment } from "../installments/installment.entity";
import { Debt } from "../debts/debt.entity";
import { User } from "@/users/user.entity";
import { TransactionType } from "./types";
import { DecimalTransformer } from "@/shared/decimal.transformer";

@Entity("transactions")
export class Transaction {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "user_id", type: "uuid" })
  userId: string;

  @ManyToOne(() => User, (u) => u.transactions, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ type: "enum", enum: TransactionType, enumName: "transaction_type" })
  type: TransactionType;

  @Column({ name: "category_id", type: "uuid", nullable: true })
  categoryId?: string | null;

  @ManyToOne(() => Category, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "category_id" })
  category?: Category | null;

  @Column({ name: "installment_id", type: "uuid", nullable: true })
  installmentId?: string | null;

  @ManyToOne(() => Installment, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "installment_id" })
  installment?: Installment | null;

  @Column({ name: "debt_id", type: "uuid", nullable: true })
  debtId?: string | null;

  @ManyToOne(() => Debt, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "debt_id" })
  debt?: Debt | null;

  @Column({
    type: "numeric",
    precision: 14,
    scale: 2,
    transformer: DecimalTransformer,
  })
  amount: string;

  @Index()
  @Column({ name: "occurred_at", type: "timestamptz" })
  occurredAt: Date;

  @Column({ type: "text", nullable: true })
  note?: string | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date;
}
