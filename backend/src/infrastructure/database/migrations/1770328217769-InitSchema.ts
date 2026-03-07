import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1770328217769 implements MigrationInterface {
  name = 'InitSchema1770328217769';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_8b0be371d28245da6e4f4b6187" ON "categories" ("name") `,
    );
    await queryRunner.query(
      `CREATE TABLE "project_categories" ("projectId" uuid NOT NULL, "categoryId" uuid NOT NULL, "project_id" uuid, "category_id" uuid, CONSTRAINT "UQ_7a31ae0114fb257b092ee940ad0" UNIQUE ("projectId", "categoryId"), CONSTRAINT "PK_7a31ae0114fb257b092ee940ad0" PRIMARY KEY ("projectId", "categoryId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "projectId" character varying NOT NULL, "description" character varying, "status" character varying NOT NULL, "priority" integer NOT NULL, "dueDate" date, "aiGenerated" boolean NOT NULL DEFAULT false, "project_id" uuid, CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "projects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "ownerId" uuid NOT NULL, "description" character varying, "budgetMin" integer, "budgetMax" integer, "status" character varying NOT NULL, "dueDate" date, CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "project_technologies" ("projectId" uuid NOT NULL, "technologyId" uuid NOT NULL, "project_id" uuid, "technology_id" uuid, CONSTRAINT "UQ_abaaeb1b993b4480923602e957d" UNIQUE ("projectId", "technologyId"), CONSTRAINT "PK_abaaeb1b993b4480923602e957d" PRIMARY KEY ("projectId", "technologyId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "technologies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "PK_9a97465b79568f00becacdd4e4a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_46800813f460eb131823371cae" ON "technologies" ("name") `,
    );
    await queryRunner.query(
      `ALTER TABLE "project_categories" ADD CONSTRAINT "FK_3a55961fc2a7ee7e324844cb2f9" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_categories" ADD CONSTRAINT "FK_678d720a87c534b1043688d8d96" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_9eecdb5b1ed8c7c2a1b392c28d4" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_technologies" ADD CONSTRAINT "FK_f47224297940ea91297f9aaa898" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_technologies" ADD CONSTRAINT "FK_76db2dc46856d239349e74e761b" FOREIGN KEY ("technology_id") REFERENCES "technologies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_technologies" DROP CONSTRAINT "FK_76db2dc46856d239349e74e761b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_technologies" DROP CONSTRAINT "FK_f47224297940ea91297f9aaa898"`,
    );
    await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_9eecdb5b1ed8c7c2a1b392c28d4"`);
    await queryRunner.query(
      `ALTER TABLE "project_categories" DROP CONSTRAINT "FK_678d720a87c534b1043688d8d96"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_categories" DROP CONSTRAINT "FK_3a55961fc2a7ee7e324844cb2f9"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_46800813f460eb131823371cae"`);
    await queryRunner.query(`DROP TABLE "technologies"`);
    await queryRunner.query(`DROP TABLE "project_technologies"`);
    await queryRunner.query(`DROP TABLE "projects"`);
    await queryRunner.query(`DROP TABLE "tasks"`);
    await queryRunner.query(`DROP TABLE "project_categories"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_8b0be371d28245da6e4f4b6187"`);
    await queryRunner.query(`DROP TABLE "categories"`);
  }
}
