import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1777008457016 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
    
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "user" (
                "id" SERIAL PRIMARY KEY,
                "username" VARCHAR NOT NULL UNIQUE,
                "email" VARCHAR NOT NULL UNIQUE,
                "password" VARCHAR NOT NULL
            )
        `);

        await queryRunner.query(`
            DO $$ BEGIN
                CREATE TYPE "notification_type_enum" AS ENUM ('email', 'sms', 'push');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "notification" (
                "id" SERIAL PRIMARY KEY,
                "userId" INTEGER NOT NULL,
                "title" VARCHAR NOT NULL,
                "message" VARCHAR NOT NULL,
                "type" "notification_type_enum" NOT NULL DEFAULT 'sms',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "isRead" BOOLEAN NOT NULL DEFAULT false,
                "readAt" TIMESTAMP,
                CONSTRAINT "FK_notification_user" 
                    FOREIGN KEY ("userId") 
                    REFERENCES "user"("id") 
                    ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Rollback en orden inverso — primero la que tiene FK
        await queryRunner.query(`DROP TABLE "notification"`);
        await queryRunner.query(`DROP TYPE "notification_type_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }
}