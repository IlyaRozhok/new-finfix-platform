import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('monthly_summaries')
export class MonthlySummary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  month: number;

  @Column()
  year: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  totalIncome: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  totalExpenses: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  netAmount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, user => user.monthlySummaries)
  @JoinColumn({ name: 'userId' })
  user: User;
}
