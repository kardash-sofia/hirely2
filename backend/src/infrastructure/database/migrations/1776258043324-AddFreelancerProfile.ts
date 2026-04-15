import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFreelancerProfile1776258043324 implements MigrationInterface {
  name = 'AddFreelancerProfile1776258043324';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "skills" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "UQ_81f05095507fd84aa2769b4a522" UNIQUE ("name"), CONSTRAINT "PK_0d3212120f4ecedf90864d7e298" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "freelancer_profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "bio" character varying, "hourlyRate" numeric, "location" character varying, "experienceLevel" character varying, "rating" integer NOT NULL DEFAULT '0', CONSTRAINT "REL_6116339abc1c512d102dbb59c9" UNIQUE ("userId"), CONSTRAINT "PK_3eacb4d71c265d274caa9ca0de0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "freelancer_profile_skills" ("freelancerProfilesId" uuid NOT NULL, "skillsId" uuid NOT NULL, CONSTRAINT "PK_a29232eec5d57e864c318368190" PRIMARY KEY ("freelancerProfilesId", "skillsId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f9a2480330c14f80bd148dd2ff" ON "freelancer_profile_skills" ("freelancerProfilesId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_db493b0ba97048b5efd3ab3802" ON "freelancer_profile_skills" ("skillsId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "freelancer_profile_categories" ("freelancerProfilesId" uuid NOT NULL, "categoriesId" uuid NOT NULL, CONSTRAINT "PK_28c81abb9e06fc928c77557f8ce" PRIMARY KEY ("freelancerProfilesId", "categoriesId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8bf0839cf6b1f78ca22866e950" ON "freelancer_profile_categories" ("freelancerProfilesId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8c1c6ba984276624bc81d23e2d" ON "freelancer_profile_categories" ("categoriesId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "freelancer_profiles" ADD CONSTRAINT "FK_6116339abc1c512d102dbb59c9c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "freelancer_profile_skills" ADD CONSTRAINT "FK_f9a2480330c14f80bd148dd2fff" FOREIGN KEY ("freelancerProfilesId") REFERENCES "freelancer_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "freelancer_profile_skills" ADD CONSTRAINT "FK_db493b0ba97048b5efd3ab3802a" FOREIGN KEY ("skillsId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "freelancer_profile_categories" ADD CONSTRAINT "FK_8bf0839cf6b1f78ca22866e9501" FOREIGN KEY ("freelancerProfilesId") REFERENCES "freelancer_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "freelancer_profile_categories" ADD CONSTRAINT "FK_8c1c6ba984276624bc81d23e2d4" FOREIGN KEY ("categoriesId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "freelancer_profile_categories" DROP CONSTRAINT "FK_8c1c6ba984276624bc81d23e2d4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "freelancer_profile_categories" DROP CONSTRAINT "FK_8bf0839cf6b1f78ca22866e9501"`,
    );
    await queryRunner.query(
      `ALTER TABLE "freelancer_profile_skills" DROP CONSTRAINT "FK_db493b0ba97048b5efd3ab3802a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "freelancer_profile_skills" DROP CONSTRAINT "FK_f9a2480330c14f80bd148dd2fff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "freelancer_profiles" DROP CONSTRAINT "FK_6116339abc1c512d102dbb59c9c"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_8c1c6ba984276624bc81d23e2d"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_8bf0839cf6b1f78ca22866e950"`);
    await queryRunner.query(`DROP TABLE "freelancer_profile_categories"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_db493b0ba97048b5efd3ab3802"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_f9a2480330c14f80bd148dd2ff"`);
    await queryRunner.query(`DROP TABLE "freelancer_profile_skills"`);
    await queryRunner.query(`DROP TABLE "freelancer_profiles"`);
    await queryRunner.query(`DROP TABLE "skills"`);
  }
}
