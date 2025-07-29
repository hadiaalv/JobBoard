import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1753785000000 implements MigrationInterface {
    name = 'CreateUsersTable1753785000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create users table with all required fields
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "firstName" character varying NOT NULL,
                "lastName" character varying NOT NULL,
                "role" "users_role_enum" NOT NULL DEFAULT 'job_seeker',
                "company" character varying,
                "bio" text,
                "skills" text,
                "experience" character varying,
                "avatar" character varying,
                "resume" character varying,
                "location" character varying,
                "phone" character varying,
                "website" character varying,
                "education" character varying,
                "interests" text,
                "languages" text,
                "certifications" text,
                "projects" text,
                "linkedin" character varying,
                "github" character varying,
                "portfolio" character varying,
                "yearsOfExperience" integer,
                "preferredWorkType" character varying,
                "salaryExpectation" character varying,
                "availability" text,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);

        // Create enum for user roles if it doesn't exist
        await queryRunner.query(`
            DO $$ BEGIN
                CREATE TYPE "users_role_enum" AS ENUM('job_seeker', 'employer', 'admin');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);

        // Create jobs table
        await queryRunner.query(`
            CREATE TABLE "jobs" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying NOT NULL,
                "description" text NOT NULL,
                "location" character varying,
                "salary" character varying,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "employerId" uuid,
                CONSTRAINT "PK_cf0a6c42b72fcc7f7c237def345" PRIMARY KEY ("id")
            )
        `);

        // Create applications table
        await queryRunner.query(`
            CREATE TABLE "applications" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "coverLetter" text,
                "resumeFilename" character varying,
                "resumeUrl" character varying,
                "status" "applications_status_enum" NOT NULL DEFAULT 'pending',
                "notes" text,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "applicantId" uuid,
                "jobId" uuid,
                CONSTRAINT "PK_938c0a27255637bde919591888f" PRIMARY KEY ("id")
            )
        `);

        // Create enum for application status if it doesn't exist
        await queryRunner.query(`
            DO $$ BEGIN
                CREATE TYPE "applications_status_enum" AS ENUM('pending', 'reviewed', 'shortlisted', 'rejected', 'hired');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);

        // Create contact table
        await queryRunner.query(`
            CREATE TABLE "contact" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "email" character varying NOT NULL,
                "subject" character varying NOT NULL,
                "message" text NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_contact_id" PRIMARY KEY ("id")
            )
        `);

        // Add foreign key constraints
        await queryRunner.query(`
            ALTER TABLE "jobs" ADD CONSTRAINT "FK_62e3afafda3cf7db0a08982a5b1" 
            FOREIGN KEY ("employerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "applications" ADD CONSTRAINT "FK_909867e55cc94e350ae38383cb5" 
            FOREIGN KEY ("applicantId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "applications" ADD CONSTRAINT "FK_f6ebb8bc5061068e4dd97df3c77" 
            FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraints
        await queryRunner.query(`ALTER TABLE "applications" DROP CONSTRAINT "FK_f6ebb8bc5061068e4dd97df3c77"`);
        await queryRunner.query(`ALTER TABLE "applications" DROP CONSTRAINT "FK_909867e55cc94e350ae38383cb5"`);
        await queryRunner.query(`ALTER TABLE "jobs" DROP CONSTRAINT "FK_62e3afafda3cf7db0a08982a5b1"`);

        // Drop tables
        await queryRunner.query(`DROP TABLE "contact"`);
        await queryRunner.query(`DROP TABLE "applications"`);
        await queryRunner.query(`DROP TABLE "jobs"`);
        await queryRunner.query(`DROP TABLE "users"`);

        // Drop enums
        await queryRunner.query(`DROP TYPE "applications_status_enum"`);
        await queryRunner.query(`DROP TYPE "users_role_enum"`);
    }
}