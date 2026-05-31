CREATE TABLE "cat_atractivos" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(255) NOT NULL,
	"descripcion" text,
	"categoria" varchar(100),
	"municipio" varchar(100),
	"estado" varchar(100),
	"direccion" text,
	"precio" numeric(10, 2),
	"hora_apertura" time,
	"hora_cierre" time,
	"lat" numeric(10, 8),
	"long" numeric(11, 8)
);
--> statement-breakpoint
CREATE TABLE "cat_imagenes" (
	"id" serial PRIMARY KEY NOT NULL,
	"id_cat_atractivo" integer NOT NULL,
	"url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cat_servicios_locales" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(255) NOT NULL,
	"descripcion" text,
	"categoria" varchar(100),
	"municipio" varchar(100),
	"estado" varchar(100),
	"direccion" text,
	"precio" numeric(10, 2),
	"hora_apertura" time,
	"hora_cierre" time,
	"lat" numeric(10, 8),
	"long" numeric(11, 8)
);
--> statement-breakpoint
CREATE TABLE "chat_ia" (
	"id" serial PRIMARY KEY NOT NULL,
	"id_user" integer NOT NULL,
	"mensaje" text NOT NULL,
	"respuesta_ia" text NOT NULL,
	"lat" numeric(10, 8),
	"long" numeric(11, 8),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "detalle_itinerario" (
	"id" serial PRIMARY KEY NOT NULL,
	"id_itinerario" integer NOT NULL,
	"id_cat_atractivos" integer,
	"id_servicios_locales" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "historial" (
	"id" serial PRIMARY KEY NOT NULL,
	"id_itinerario" integer NOT NULL,
	"id_detalle_itinerario" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(100) NOT NULL,
	"apellido" varchar(100) NOT NULL,
	"correo" varchar(255) NOT NULL,
	"contrasena" text NOT NULL,
	"telefono" varchar(20),
	"lat" numeric(10, 8),
	"long" numeric(11, 8),
	CONSTRAINT "users_correo_unique" UNIQUE("correo")
);
--> statement-breakpoint
CREATE TABLE "itinerario" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"punto_inicio" varchar(255) NOT NULL,
	"lat" numeric(10, 8),
	"long" numeric(11, 8),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pagos" (
	"id" serial PRIMARY KEY NOT NULL,
	"id_user" integer NOT NULL,
	"monto" numeric(10, 2) NOT NULL,
	"concepto" varchar(255) NOT NULL,
	"metodo" varchar(50) NOT NULL,
	"status" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cat_imagenes" ADD CONSTRAINT "cat_imagenes_id_cat_atractivo_cat_atractivos_id_fk" FOREIGN KEY ("id_cat_atractivo") REFERENCES "public"."cat_atractivos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_ia" ADD CONSTRAINT "chat_ia_id_user_users_id_fk" FOREIGN KEY ("id_user") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "detalle_itinerario" ADD CONSTRAINT "detalle_itinerario_id_itinerario_itinerario_id_fk" FOREIGN KEY ("id_itinerario") REFERENCES "public"."itinerario"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "detalle_itinerario" ADD CONSTRAINT "detalle_itinerario_id_cat_atractivos_cat_atractivos_id_fk" FOREIGN KEY ("id_cat_atractivos") REFERENCES "public"."cat_atractivos"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "detalle_itinerario" ADD CONSTRAINT "detalle_itinerario_id_servicios_locales_cat_servicios_locales_id_fk" FOREIGN KEY ("id_servicios_locales") REFERENCES "public"."cat_servicios_locales"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "historial" ADD CONSTRAINT "historial_id_itinerario_itinerario_id_fk" FOREIGN KEY ("id_itinerario") REFERENCES "public"."itinerario"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "historial" ADD CONSTRAINT "historial_id_detalle_itinerario_detalle_itinerario_id_fk" FOREIGN KEY ("id_detalle_itinerario") REFERENCES "public"."detalle_itinerario"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "itinerario" ADD CONSTRAINT "itinerario_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_id_user_users_id_fk" FOREIGN KEY ("id_user") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;