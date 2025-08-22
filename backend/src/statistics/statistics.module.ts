import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonthlySummary } from './monthly-summary.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MonthlySummary])],
  exports: [TypeOrmModule],
})
export class StatisticsModule {}
