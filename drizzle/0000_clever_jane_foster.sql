CREATE TABLE "admin" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar,
	"user_name" varchar NOT NULL,
	"email" varchar(256) NOT NULL,
	"password" varchar(256) NOT NULL,
	"role" varchar,
	"manager_login_id" varchar,
	"manager_login_password" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "employee" (
	"id" serial PRIMARY KEY NOT NULL,
	"manager_id" integer,
	"name" varchar(256) NOT NULL,
	"user_name" varchar NOT NULL,
	"email" varchar(256) NOT NULL,
	"password" varchar(256) NOT NULL,
	"role" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "manager" (
	"id" serial PRIMARY KEY NOT NULL,
	"admin_id" integer,
	"name" varchar(256) NOT NULL,
	"user_name" varchar NOT NULL,
	"email" varchar(256) NOT NULL,
	"role" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "task" (
	"id" serial PRIMARY KEY NOT NULL,
	"manager_id" integer,
	"task_name" varchar(256) NOT NULL,
	"task_description" varchar NOT NULL,
	"status" varchar DEFAULT 'incompleted',
	"due_date" varchar NOT NULL,
	"priority" varchar,
	"is_deleted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "task_assigned" (
	"id" serial PRIMARY KEY NOT NULL,
	"assigned_by" integer,
	"task_id" integer,
	"assigned_to" integer,
	"is_completed" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "employee" ADD CONSTRAINT "employee_manager_id_manager_id_fk" FOREIGN KEY ("manager_id") REFERENCES "public"."manager"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manager" ADD CONSTRAINT "manager_admin_id_admin_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."admin"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_manager_id_manager_id_fk" FOREIGN KEY ("manager_id") REFERENCES "public"."manager"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_assigned" ADD CONSTRAINT "task_assigned_assigned_by_manager_id_fk" FOREIGN KEY ("assigned_by") REFERENCES "public"."manager"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_assigned" ADD CONSTRAINT "task_assigned_task_id_task_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."task"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_assigned" ADD CONSTRAINT "task_assigned_assigned_to_employee_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."employee"("id") ON DELETE no action ON UPDATE no action;