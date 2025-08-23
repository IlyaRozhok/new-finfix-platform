import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUsefulIndexes1755944520331 implements MigrationInterface {
  name = "AddUsefulIndexes1755944520331";
  public async up(q: QueryRunner): Promise<void> {
    // Частые выборки по платежам рассрочек/кредитов
    await q.query(`
        CREATE INDEX IF NOT EXISTS idx_tx_installment
        ON transactions(installment_id)
        WHERE installment_id IS NOT NULL
      `);

    await q.query(`
        CREATE INDEX IF NOT EXISTS idx_tx_debt
        ON transactions(debt_id)
        WHERE debt_id IS NOT NULL
      `);

    // Агрегации за месяц/по типу + сортировка по дате
    await q.query(`
        CREATE INDEX IF NOT EXISTS idx_tx_user_type_date
        ON transactions(user_id, type, occurred_at DESC)
      `);

    // Активные долги (частичный индекс)
    await q.query(`
        CREATE INDEX IF NOT EXISTS idx_debts_user_active
        ON debts(user_id)
        WHERE is_closed = false
      `);

    // Активные рассрочки (частичный индекс)
    await q.query(`
        CREATE INDEX IF NOT EXISTS idx_installments_user_active
        ON installments(user_id)
        WHERE is_closed = false
      `);
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.query(`DROP INDEX IF EXISTS idx_installments_user_active`);
    await q.query(`DROP INDEX IF EXISTS idx_debts_user_active`);
    await q.query(`DROP INDEX IF EXISTS idx_tx_user_type_date`);
    await q.query(`DROP INDEX IF EXISTS idx_tx_debt`);
    await q.query(`DROP INDEX IF EXISTS idx_tx_installment`);
  }
}
