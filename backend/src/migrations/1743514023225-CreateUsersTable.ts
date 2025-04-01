import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1743514023225 implements MigrationInterface {
    name = 'CreateUsersTable1743514023225'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_entity_role_enum" AS ENUM('user', 'premium', 'admin')`);
        await queryRunner.query(`CREATE TABLE "user_entity" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."user_entity_role_enum" NOT NULL DEFAULT 'user', CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user_entity"`);
        await queryRunner.query(`DROP TYPE "public"."user_entity_role_enum"`);
    }

}
