import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUserLabTableMigration implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_labs',
        columns: [
          { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
          { name: 'userId', type: 'int' },
          { name: 'labId', type: 'uuid' },
          { name: 'progress', type: 'float', isNullable: true },
          { name: 'grade', type: 'float', isNullable: true },
          { name: 'created', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updated', type: 'timestamp', isNullable: true },
        ],
        foreignKeys: [
          {
            columnNames: ['userId'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['labId'],
            referencedTableName: 'labs',
            referencedColumnNames: ['uuid'],
            onDelete: 'CASCADE',
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_labs');
  }
}