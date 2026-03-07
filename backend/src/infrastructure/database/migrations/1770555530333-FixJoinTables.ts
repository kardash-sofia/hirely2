import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixJoinTables1770555530333 implements MigrationInterface {
  name = 'FixJoinTables1770555530333';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_categories" DROP CONSTRAINT "FK_3a55961fc2a7ee7e324844cb2f9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_categories" DROP CONSTRAINT "FK_678d720a87c534b1043688d8d96"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_technologies" DROP CONSTRAINT "FK_f47224297940ea91297f9aaa898"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_technologies" DROP CONSTRAINT "FK_76db2dc46856d239349e74e761b"`,
    );
    await queryRunner.query(`ALTER TABLE "project_categories" DROP COLUMN "project_id"`);
    await queryRunner.query(`ALTER TABLE "project_categories" DROP COLUMN "category_id"`);
    await queryRunner.query(`ALTER TABLE "project_technologies" DROP COLUMN "project_id"`);
    await queryRunner.query(`ALTER TABLE "project_technologies" DROP COLUMN "technology_id"`);
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "status"`);
    await queryRunner.query(
      `CREATE TYPE "public"."tasks_status_enum" AS ENUM('draft', 'todo', 'on_hold', 'in_progress', 'in_review', 'completed', 'cancelled')`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD "status" "public"."tasks_status_enum" NOT NULL DEFAULT 'todo'`,
    );
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "status"`);
    await queryRunner.query(
      `CREATE TYPE "public"."projects_status_enum" AS ENUM('open', 'pending_review', 'in_progress', 'completed', 'cancelled')`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" ADD "status" "public"."projects_status_enum" NOT NULL DEFAULT 'open'`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_categories" ADD CONSTRAINT "UQ_7a31ae0114fb257b092ee940ad0" UNIQUE ("projectId", "categoryId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_technologies" ADD CONSTRAINT "UQ_abaaeb1b993b4480923602e957d" UNIQUE ("projectId", "technologyId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_categories" ADD CONSTRAINT "FK_4b3ae99beef33e732fb63185009" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_categories" ADD CONSTRAINT "FK_1c3ef809362ea005697d86e8288" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_technologies" ADD CONSTRAINT "FK_060c20ff18e52766bce563b0523" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_technologies" ADD CONSTRAINT "FK_f8d58af88a6743390a911f257a7" FOREIGN KEY ("technologyId") REFERENCES "technologies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_technologies" DROP CONSTRAINT "FK_f8d58af88a6743390a911f257a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_technologies" DROP CONSTRAINT "FK_060c20ff18e52766bce563b0523"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_categories" DROP CONSTRAINT "FK_1c3ef809362ea005697d86e8288"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_categories" DROP CONSTRAINT "FK_4b3ae99beef33e732fb63185009"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_technologies" DROP CONSTRAINT "UQ_abaaeb1b993b4480923602e957d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_categories" DROP CONSTRAINT "UQ_7a31ae0114fb257b092ee940ad0"`,
    );
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."projects_status_enum"`);
    await queryRunner.query(`ALTER TABLE "projects" ADD "status" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."tasks_status_enum"`);
    await queryRunner.query(`ALTER TABLE "tasks" ADD "status" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "project_technologies" ADD "technology_id" uuid`);
    await queryRunner.query(`ALTER TABLE "project_technologies" ADD "project_id" uuid`);
    await queryRunner.query(`ALTER TABLE "project_categories" ADD "category_id" uuid`);
    await queryRunner.query(`ALTER TABLE "project_categories" ADD "project_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "project_technologies" ADD CONSTRAINT "FK_76db2dc46856d239349e74e761b" FOREIGN KEY ("technology_id") REFERENCES "technologies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_technologies" ADD CONSTRAINT "FK_f47224297940ea91297f9aaa898" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_categories" ADD CONSTRAINT "FK_678d720a87c534b1043688d8d96" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_categories" ADD CONSTRAINT "FK_3a55961fc2a7ee7e324844cb2f9" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
