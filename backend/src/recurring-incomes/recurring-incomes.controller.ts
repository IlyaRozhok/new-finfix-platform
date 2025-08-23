import { Controller } from '@nestjs/common';
import { RecurringIncomesService } from './recurring-incomes.service';

@Controller('recurring-incomes')
export class RecurringIncomesController {
  constructor(private readonly recurringIncomesService: RecurringIncomesService) {}
}
