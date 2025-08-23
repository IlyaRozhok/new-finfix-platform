import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1755943618564 implements MigrationInterface {
  name = "InitSchema1755943618564";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    await queryRunner.query(
      `CREATE TYPE "public"."category_kind" AS ENUM('expense', 'income')`
    );
    await queryRunner.query(
      `CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "kind" "public"."category_kind" NOT NULL, "name" character varying(64) NOT NULL, "is_system" boolean NOT NULL DEFAULT false, CONSTRAINT "uq_categories_user_kind_name" UNIQUE ("user_id", "kind", "name"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8b0be371d28245da6e4f4b6187" ON "categories" ("name") `
    );
    await queryRunner.query(
      `CREATE TYPE "public"."debt_type" AS ENUM('loan', 'credit_card')`
    );
    await queryRunner.query(
      `CREATE TABLE "debts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "description" text NOT NULL, "debt_type" "public"."debt_type" NOT NULL, "total_debt" numeric(14,2) NOT NULL, "monthly_payment" numeric(14,2), "interest_rate_monthly" numeric(6,3), "grace_period_days" integer, "start_date" date NOT NULL, "statement_day" smallint, "due_day" smallint, "is_closed" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_4bd9f54aab9e59628a3a2657fa1" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_39f44d157a832647f1be641cb1" ON "debts" ("start_date") `
    );
    await queryRunner.query(
      `CREATE INDEX "idx_debts_user_active" ON "debts" ("user_id") WHERE "is_closed" = false`
    );
    await queryRunner.query(
      `CREATE TABLE "installments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "description" text NOT NULL, "start_date" date NOT NULL, "total_amount" numeric(14,2) NOT NULL, "monthly_payment" numeric(14,2) NOT NULL, "total_payments" integer NOT NULL, "is_closed" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_c74e44aa06bdebef2af0a93da1b" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2bd3408f15da261cbcdb57edf6" ON "installments" ("start_date") `
    );
    await queryRunner.query(
      `CREATE TABLE "recurring_expense" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "category_id" uuid NOT NULL, "description" text NOT NULL, "amount" numeric(14,2) NOT NULL, "is_mandatory" boolean NOT NULL DEFAULT false, "start_date" date NOT NULL, "end_date" date, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_e10f09121d23af7e23a0028ba00" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cb98dd4ecdbf2e14a29bcfaf3c" ON "recurring_expense" ("start_date") `
    );
    await queryRunner.query(
      `CREATE TABLE "recurring_income" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "description" text NOT NULL, "amount" numeric(14,2) NOT NULL, "start_date" date NOT NULL, "end_date" date, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_a61fffba1c4e85548b7fe42314a" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c1299a1cc68bc85a348e406f8c" ON "recurring_income" ("start_date") `
    );
    await queryRunner.query(
      `CREATE TYPE "public"."transaction_type" AS ENUM('income', 'expense', 'installment_payment', 'debt_payment', 'transfer')`
    );
    await queryRunner.query(
      `CREATE TABLE "transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "type" "public"."transaction_type" NOT NULL, "category_id" uuid, "installment_id" uuid, "debt_id" uuid, "amount" numeric(14,2) NOT NULL, "occurred_at" TIMESTAMP WITH TIME ZONE NOT NULL, "note" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_97ff86c4b451237920f18c5421" ON "transactions" ("occurred_at") `
    );
    await queryRunner.query(
      `CREATE INDEX "idx_transactions_user_date" ON "transactions" ("user_id", "occurred_at") `
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255) NOT NULL, "google_sub" text NOT NULL, "user_name" character varying(150) NOT NULL, "avatar_url" text, "is_onboarded" boolean NOT NULL DEFAULT false, "currency" character(3) NOT NULL DEFAULT 'UAH', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_68b61ba0fb359b93b517cf1073d" UNIQUE ("google_sub"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "categories" ADD CONSTRAINT "FK_2296b7fe012d95646fa41921c8b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "debts" ADD CONSTRAINT "FK_c7948d788f06ddc7e0e6ce68ca3" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "installments" ADD CONSTRAINT "FK_bbff62fe8ef1d6dfc1a6518a020" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "recurring_expense" ADD CONSTRAINT "FK_04d0b5ac05e2c8ef1368c1dccd0" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "recurring_expense" ADD CONSTRAINT "FK_f472a254aea09af216f17527dbc" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "recurring_income" ADD CONSTRAINT "FK_e4428cb592ae36712ee4567f30d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_e9acc6efa76de013e8c1553ed2b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_c9e41213ca42d50132ed7ab2b0f" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_2de95724a8c50980aa12cb7de0d" FOREIGN KEY ("installment_id") REFERENCES "installments"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_96ef9a6558a5a1fa49df19e2ccf" FOREIGN KEY ("debt_id") REFERENCES "debts"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP EXTENSION IF EXISTS "uuid-ossp";`);

    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_96ef9a6558a5a1fa49df19e2ccf"`
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_2de95724a8c50980aa12cb7de0d"`
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_c9e41213ca42d50132ed7ab2b0f"`
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_e9acc6efa76de013e8c1553ed2b"`
    );
    await queryRunner.query(
      `ALTER TABLE "recurring_income" DROP CONSTRAINT "FK_e4428cb592ae36712ee4567f30d"`
    );
    await queryRunner.query(
      `ALTER TABLE "recurring_expense" DROP CONSTRAINT "FK_f472a254aea09af216f17527dbc"`
    );
    await queryRunner.query(
      `ALTER TABLE "recurring_expense" DROP CONSTRAINT "FK_04d0b5ac05e2c8ef1368c1dccd0"`
    );
    await queryRunner.query(
      `ALTER TABLE "installments" DROP CONSTRAINT "FK_bbff62fe8ef1d6dfc1a6518a020"`
    );
    await queryRunner.query(
      `ALTER TABLE "debts" DROP CONSTRAINT "FK_c7948d788f06ddc7e0e6ce68ca3"`
    );
    await queryRunner.query(
      `ALTER TABLE "categories" DROP CONSTRAINT "FK_2296b7fe012d95646fa41921c8b"`
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP INDEX "public"."idx_transactions_user_date"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_97ff86c4b451237920f18c5421"`
    );
    await queryRunner.query(`DROP TABLE "transactions"`);
    await queryRunner.query(`DROP TYPE "public"."transaction_type"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c1299a1cc68bc85a348e406f8c"`
    );
    await queryRunner.query(`DROP TABLE "recurring_income"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cb98dd4ecdbf2e14a29bcfaf3c"`
    );
    await queryRunner.query(`DROP TABLE "recurring_expense"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2bd3408f15da261cbcdb57edf6"`
    );
    await queryRunner.query(`DROP TABLE "installments"`);
    await queryRunner.query(`DROP INDEX "public"."idx_debts_user_active"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_39f44d157a832647f1be641cb1"`
    );
    await queryRunner.query(`DROP TABLE "debts"`);
    await queryRunner.query(`DROP TYPE "public"."debt_type"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8b0be371d28245da6e4f4b6187"`
    );
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`DROP TYPE "public"."category_kind"`);
  }
}
