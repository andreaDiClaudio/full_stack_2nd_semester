import { MigrationInterface, QueryRunner } from "typeorm";

export class RetrieveAllElements1640123456789 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Custom logic to retrieve all elements from your table
    const results = await queryRunner.query('SELECT * FROM category');
    console.log('Retrieved elements:', results);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // No need to reverse the data retrieval in this case
  }
}
