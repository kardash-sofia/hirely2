import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTechnologiesToFreelancerProfile1779575899446 implements MigrationInterface {
  name = 'AddTechnologiesToFreelancerProfile1779575899446';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "freelancer_profile_technologies" ("freelancerProfilesId" uuid NOT NULL, "technologiesId" uuid NOT NULL, CONSTRAINT "PK_f708583890eb0570b549e68612e" PRIMARY KEY ("freelancerProfilesId", "technologiesId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_dc4c0c1b2312c7c96e88384eba" ON "freelancer_profile_technologies" ("freelancerProfilesId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c37c39ff37d002b1a158e66fd6" ON "freelancer_profile_technologies" ("technologiesId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "freelancer_profile_technologies" ADD CONSTRAINT "FK_dc4c0c1b2312c7c96e88384eba3" FOREIGN KEY ("freelancerProfilesId") REFERENCES "freelancer_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "freelancer_profile_technologies" ADD CONSTRAINT "FK_c37c39ff37d002b1a158e66fd63" FOREIGN KEY ("technologiesId") REFERENCES "technologies"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "freelancer_profile_technologies" DROP CONSTRAINT "FK_c37c39ff37d002b1a158e66fd63"`,
    );
    await queryRunner.query(
      `ALTER TABLE "freelancer_profile_technologies" DROP CONSTRAINT "FK_dc4c0c1b2312c7c96e88384eba3"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_c37c39ff37d002b1a158e66fd6"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_dc4c0c1b2312c7c96e88384eba"`);
    await queryRunner.query(`DROP TABLE "freelancer_profile_technologies"`);
  }
}
