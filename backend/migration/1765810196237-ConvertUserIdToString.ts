import { MigrationInterface, QueryRunner } from "typeorm";

export class ConvertUserIdToString1765810196237 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add temporary uuid column
        await queryRunner.query(`ALTER TABLE "User_Lab" ADD COLUMN "userId_tmp" uuid`);

        // If userId is numeric (stored as text), map using users.id
        await queryRunner.query(`
            UPDATE "User_Lab" ul
            SET "userId_tmp" = u."documentId"
            FROM "User" u
            WHERE ul."userId" ~ '^[0-9]+$' AND u.id = (ul."userId")::int
        `);

        // If userId already looks like a UUID, cast it
        await queryRunner.query(`
            UPDATE "User_Lab"
            SET "userId_tmp" = ("userId")::uuid
            WHERE "userId" ~ '^[0-9a-fA-F\\-]{36}$'
        `);

        // Drop old column and rename
        await queryRunner.query(`ALTER TABLE "User_Lab" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "User_Lab" RENAME COLUMN "userId_tmp" TO "userId"`);

        // Add foreign key to reference users(documentId)
        await queryRunner.query(`ALTER TABLE "User_Lab" ADD CONSTRAINT "FK_UserLab_User_documentId" FOREIGN KEY ("userId") REFERENCES "User" ("documentId") ON DELETE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert: create text column and map back to users.id
        await queryRunner.query(`ALTER TABLE "User_Lab" ADD COLUMN "userId_old" text`);

        await queryRunner.query(`
            UPDATE "User_Lab" ul
            SET "userId_old" = u.id::text
            FROM "User" u
            WHERE ul."userId" = u."documentId"
        `);

        // Drop FK and replace column
        await queryRunner.query(`ALTER TABLE "User_Lab" DROP CONSTRAINT IF EXISTS "FK_UserLab_User_documentId"`);
        await queryRunner.query(`ALTER TABLE "User_Lab" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "User_Lab" RENAME COLUMN "userId_old" TO "userId"`);
    }

}
