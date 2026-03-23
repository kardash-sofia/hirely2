import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAuthUserTables1772963849759 implements MigrationInterface {
  name = 'AddAuthUserTables1772963849759';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "auth_users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "password_hash" character varying NOT NULL, "refresh_token" character varying NOT NULL, CONSTRAINT "PK_c88cc8077366b470dafc2917366" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('freelancer', 'customer')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "authUserId" uuid NOT NULL, "fullName" character varying, "avatar_url" character varying, "role" "public"."users_role_enum", CONSTRAINT "REL_90a8fdabae76ae646e3b2062db" UNIQUE ("authUserId"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "projects" ADD "executorId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_90a8fdabae76ae646e3b2062db0" FOREIGN KEY ("authUserId") REFERENCES "auth_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_90a8fdabae76ae646e3b2062db0"`);
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "executorId"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(`DROP TABLE "auth_users"`);
  }
}
