import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class AddJobFavorites1703123456790 implements MigrationInterface {
    name = 'AddJobFavorites1703123456790'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "job_favorites",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()",
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "userId",
                        type: "uuid",
                    },
                    {
                        name: "jobId",
                        type: "uuid",
                    },
                ],
                uniques: [
                    {
                        name: "UQ_job_favorites_user_job",
                        columnNames: ["userId", "jobId"],
                    },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "job_favorites",
            new TableForeignKey({
                columnNames: ["userId"],
                referencedColumnNames: ["id"],
                referencedTableName: "users",
                onDelete: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "job_favorites",
            new TableForeignKey({
                columnNames: ["jobId"],
                referencedColumnNames: ["id"],
                referencedTableName: "jobs",
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("job_favorites");
        if (table) {
            const foreignKeys = table.foreignKeys;
            for (const foreignKey of foreignKeys) {
                await queryRunner.dropForeignKey("job_favorites", foreignKey);
            }
        }
        await queryRunner.dropTable("job_favorites");
    }
} 