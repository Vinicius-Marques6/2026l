CREATE TABLE "profile" (
	"id" uuid PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	CONSTRAINT "profile_email_unique" UNIQUE("email")
);

ALTER TABLE "profile" ENABLE ROW LEVEL SECURITY;