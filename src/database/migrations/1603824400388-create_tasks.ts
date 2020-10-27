import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createTasks1603824400388 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'tasks',
      columns: [
        {
          name: 'id',
          type: 'integer',
          isNullable: false,
          unsigned: true,
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment'
        },
        {
          name: 'user_id',
          type: 'integer',
        },
        {
          name: 'description',
          type: 'varchar',
          isNullable: false
        },
        {
          name: 'check',
          type: 'boolean',
          default: false,
          isNullable: false
        },
        {
          name: 'created_at',
          type: 'timestamp',
          default: 'now()'
        },
        {
          name: 'updated_at',
          type: 'timestamp',
          default: 'now()'
        },
      ],
      foreignKeys: [
        {
          name: 'TaskUser',
          columnNames: ['user_id'],
          referencedTableName: 'users',
          referencedColumnNames: ['id'],
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        }
      ]
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tasks')
  }

}
