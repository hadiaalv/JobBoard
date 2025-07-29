import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPortfolioFields1703123456789 implements MigrationInterface {
    name = 'AddPortfolioFields1703123456789'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" 
            ADD COLUMN "avatar" character varying,
            ADD COLUMN "resume" character varying,
            ADD COLUMN "location" character varying,
            ADD COLUMN "phone" character varying,
            ADD COLUMN "website" character varying,
            ADD COLUMN "education" character varying,
            ADD COLUMN "interests" text,
            ADD COLUMN "languages" text,
            ADD COLUMN "certifications" text,
            ADD COLUMN "projects" text,
            ADD COLUMN "linkedin" character varying,
            ADD COLUMN "github" character varying,
            ADD COLUMN "portfolio" character varying,
            ADD COLUMN "yearsOfExperience" integer,
            ADD COLUMN "preferredWorkType" character varying,
            ADD COLUMN "salaryExpectation" character varying,
            ADD COLUMN "availability" text
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" 
            DROP COLUMN "avatar",
            DROP COLUMN "resume",
            DROP COLUMN "location",
            DROP COLUMN "phone",
            DROP COLUMN "website",
            DROP COLUMN "education",
            DROP COLUMN "interests",
            DROP COLUMN "languages",
            DROP COLUMN "certifications",
            DROP COLUMN "projects",
            DROP COLUMN "linkedin",
            DROP COLUMN "github",
            DROP COLUMN "portfolio",
            DROP COLUMN "yearsOfExperience",
            DROP COLUMN "preferredWorkType",
            DROP COLUMN "salaryExpectation",
            DROP COLUMN "availability"
        `);
    }
}