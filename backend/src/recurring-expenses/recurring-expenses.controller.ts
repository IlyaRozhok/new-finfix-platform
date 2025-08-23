import { Controller } from '@nestjs/common';
import { RecurringExpensesService } from './recurring-expenses.service';

@Controller('recurring-expenses')
export class RecurringExpensesController {
  constructor(private readonly recurringExpensesService: RecurringExpensesService) {}
}
