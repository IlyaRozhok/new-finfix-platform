import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  BadRequestException,
} from "@nestjs/common";
import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";

import { CreateTransactionDto } from "./create-transaction.dto";
import { TransactionsService } from "./transactions.service";
import { TransactionType } from "./types";

@Controller("transactions")
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionService: TransactionsService) {}

  @Post()
  async create(@Req() req, @Body() dto: CreateTransactionDto) {
    const userId = (req.user as { sub: string }).sub;

    if (
      dto.type === TransactionType.EXPENSE ||
      dto.type === TransactionType.INCOME
    ) {
      if (dto.installmentId || dto.debtId)
        throw new BadRequestException(
          "installmentId/debtId not allowed for this type"
        );
    }
    if (
      dto.type === TransactionType.INSTALLMENT_PAYMENT &&
      !dto.installmentId
    ) {
      throw new BadRequestException(
        "installmentId is required for installment_payment"
      );
    }
    if (dto.type === TransactionType.DEBT_PAYMENT && !dto.debtId) {
      throw new BadRequestException("debtId is required for debt_payment");
    }

    return this.transactionService.create(userId, dto);
  }
}
