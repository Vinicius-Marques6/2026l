CREATE TABLE "drink_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"alcohol_content" real NOT NULL,
	"default_volume" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_id" integer NOT NULL,
	"drink_type_id" integer NOT NULL,
	"notes" text,
	"quantity" real NOT NULL,
	"volume" integer NOT NULL,
	"calculated_doses" real NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"name" text,
	"email" text NOT NULL,
	"avatar_url" text,
	CONSTRAINT "profile_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "profile_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "logs" ADD CONSTRAINT "logs_profile_id_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "logs" ADD CONSTRAINT "logs_drink_type_id_drink_types_id_fk" FOREIGN KEY ("drink_type_id") REFERENCES "public"."drink_types"("id") ON DELETE no action ON UPDATE no action;

ALTER TABLE "profile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "drink_types" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "logs" ENABLE ROW LEVEL SECURITY;