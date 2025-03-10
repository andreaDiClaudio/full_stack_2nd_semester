import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatedTables1741611966946 implements MigrationInterface {
    name = 'CreatedTables1741611966946'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "entry" DROP CONSTRAINT "FK_5e1c00d1bf0d7f449fbd257d3c8"`);
        await queryRunner.query(`ALTER TABLE "entry" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "entry" ADD "amount" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "entry" ALTER COLUMN "categoryId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "entry" ADD CONSTRAINT "FK_5e1c00d1bf0d7f449fbd257d3c8" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "entry" DROP CONSTRAINT "FK_5e1c00d1bf0d7f449fbd257d3c8"`);
        await queryRunner.query(`ALTER TABLE "entry" ALTER COLUMN "categoryId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "entry" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "entry" ADD "amount" numeric(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "entry" ADD CONSTRAINT "FK_category_entry" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
}
