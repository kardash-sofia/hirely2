import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProjectApplications1776465117391 implements MigrationInterface {
  name = 'AddProjectApplications1776465117391';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."project_applications_status_enum" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN')`,
    );
    await queryRunner.query(
      `CREATE TABLE "project_applications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "projectId" uuid NOT NULL, "freelancerId" uuid NOT NULL, "coverLetter" text, "status" "public"."project_applications_status_enum" NOT NULL DEFAULT 'PENDING', CONSTRAINT "UQ_80f89d0bd675c35b5eb24b308a5" UNIQUE ("projectId", "freelancerId"), CONSTRAINT "PK_e25766bda40c41346e3da775f69" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_applications" ADD CONSTRAINT "FK_2c3d5b120a01aabc3d61215e135" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_applications" ADD CONSTRAINT "FK_e4f4772307e80043c9512704227" FOREIGN KEY ("freelancerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_applications" DROP CONSTRAINT "FK_e4f4772307e80043c9512704227"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_applications" DROP CONSTRAINT "FK_2c3d5b120a01aabc3d61215e135"`,
    );
    await queryRunner.query(`DROP TABLE "project_applications"`);
    await queryRunner.query(`DROP TYPE "public"."project_applications_status_enum"`);
  }
}
