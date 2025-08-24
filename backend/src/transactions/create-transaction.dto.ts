import {
  IsEnum,
  IsNumber,
  IsISO8601,
  IsOptional,
  IsUUID,
  IsString,
} from "@nestjs/class-validator";
import { TransactionType } from "./types";

export class CreateTransactionDto {
  @IsEnum(TransactionType) type: TransactionType;
  @IsNumber() amount: number;
  @IsISO8601() occurredAt: string;

  @IsOptional() @IsUUID() categoryId?: string;
  @IsOptional() @IsUUID() installmentId?: string;
  @IsOptional() @IsUUID() debtId?: string;
  @IsOptional() @IsString() note?: string;
}
