import { Module } from '@nestjs/common';
import { RecurringIncomesService } from './recurring-incomes.service';
import { RecurringIncomesController } from './recurring-incomes.controller';

@Module({
  controllers: [RecurringIncomesController],
  providers: [RecurringIncomesService],
})
export class RecurringIncomesModule {}
