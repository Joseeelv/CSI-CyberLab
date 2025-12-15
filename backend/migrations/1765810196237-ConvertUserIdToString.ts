import { MigrationInterface, QueryRunner } from "typeorm";

export class ConvertUserIdIntToUuid1765810196237 implements MigrationInterface {
  name = 'ConvertUserIdIntToUuid1765810196237'  // ✅ Agregado el timestamp

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Elimina la FK si existe
    await queryRunner.query(`
      ALTER TABLE "User_Lab"
      DROP CONSTRAINT IF EXISTS "FK_UserLab_User_documentId"
    `);

    // Cambia el tipo de userId a uuid
    await queryRunner.query(`
      ALTER TABLE "User_Lab"
      ALTER COLUMN "userId" TYPE uuid USING "userId"::uuid
    `);

    // Vuelve a crear la FK
    await queryRunner.query(`
      ALTER TABLE "User_Lab"
      ADD CONSTRAINT "FK_UserLab_User_documentId"
      FOREIGN KEY ("userId") REFERENCES "User"("documentId") ON DELETE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Elimina la FK
    await queryRunner.query(`
      ALTER TABLE "User_Lab"
      DROP CONSTRAINT IF EXISTS "FK_UserLab_User_documentId"
    `);

    // Cambia el tipo de userId a integer
    await queryRunner.query(`
      ALTER TABLE "User_Lab"
      ALTER COLUMN "userId" TYPE integer USING "userId"::integer
    `);
  }
}
