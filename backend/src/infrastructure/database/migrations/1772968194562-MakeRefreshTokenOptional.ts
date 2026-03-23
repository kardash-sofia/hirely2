import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeRefreshTokenOptional1772968194562 implements MigrationInterface {
  name = 'MakeRefreshTokenOptional1772968194562';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "auth_users" ALTER COLUMN "refresh_token" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "auth_users" ALTER COLUMN "refresh_token" SET NOT NULL`);
  }
}
