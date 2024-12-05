import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env variables
dotenv.config({ path: path.resolve(__dirname, '..', '..', '..', '.env') });

export class CreateGodAdmin1733403860443 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // God Admin details
    const firstName = process.env.GOD_ADMIN_FIRST_NAME;
    const lastName = process.env.GOD_ADMIN_LAST_NAME;
    const phoneNumber = process.env.GOD_ADMIN_PHONE_NUMBER;
    const birthDate = process.env.GOD_ADMIN_BIRTH_DATE;
    const gender = process.env.GOD_ADMIN_GENDER;
    const profileImage = process.env.GOD_ADMIN_PROFILE_IMAGE;
    const plainPassword = process.env.GOD_ADMIN_PASSWORD;
    const saltRounds = 10;

    // Hash the password
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    // Insert God Admin into the database
    await queryRunner.query(
      `
      INSERT INTO "user" (username, "firstName", "lastName", "phoneNumber", "birthDate", "gender", "profileImage", "password")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `,
      [
        `user-${phoneNumber}-${new Date().getFullYear()}`, // Generate username dynamically
        firstName,
        lastName,
        phoneNumber,
        birthDate,
        gender,
        profileImage !== 'null' ? profileImage : null, // Handle null as a string
        hashedPassword,
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove God Admin entry if the migration is rolled back
    const phoneNumber = process.env.GOD_ADMIN_PHONE_NUMBER;

    await queryRunner.query(
      `
      DELETE FROM "user" WHERE "phoneNumber" = $1
      `,
      [phoneNumber],
    );
  }
}
