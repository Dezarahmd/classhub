SET local check_function_bodies = off;

CREATE TABLE "public"."assignment_progress" (
  "id"            uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "assignment_id" uuid                     NOT NULL,
  "student_id"    uuid                     NOT NULL,
  "status"        text                     NOT NULL DEFAULT 'not_started'::text,
  "updated_at"    timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "assignment_progress_assignment_id_student_id_key" UNIQUE (assignment_id, student_id),
  CONSTRAINT "assignment_progress_pkey" PRIMARY KEY (id),
  CONSTRAINT "assignment_progress_status_check" CHECK ((status = ANY (ARRAY['not_started'::text, 'in_progress'::text, 'completed'::text])))
);

ALTER TABLE "public"."assignment_progress"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."assignments" (
  "id"          uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "class_id"    uuid                     NOT NULL,
  "subject_id"  uuid                     NOT NULL,
  "title"       text                     NOT NULL,
  "description" text,
  "deadline"    timestamp with time zone NOT NULL,
  "is_active"   boolean                  NOT NULL DEFAULT true,
  "created_by"  uuid,
  "created_at"  timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"  timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "assignments_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."assignments"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."class_members" (
  "id"        uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "class_id"  uuid                     NOT NULL,
  "user_id"   uuid                     NOT NULL,
  "role"      text                     NOT NULL DEFAULT 'mahasiswa'::text,
  "joined_at" timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "class_members_class_id_user_id_key" UNIQUE (class_id, user_id),
  CONSTRAINT "class_members_pkey" PRIMARY KEY (id),
  CONSTRAINT "class_members_role_check" CHECK ((role = ANY (ARRAY['ketua'::text, 'wakil'::text, 'mahasiswa'::text])))
);

ALTER TABLE "public"."class_members"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."class_roster" (
  "id"         uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "class_id"   uuid                     NOT NULL,
  "full_name"  text                     NOT NULL,
  "nim"        text                     NOT NULL,
  "email"      text                     NOT NULL,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "class_roster_class_id_email_key" UNIQUE (class_id, email),
  CONSTRAINT "class_roster_class_id_nim_key" UNIQUE (class_id, nim),
  CONSTRAINT "class_roster_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."class_roster"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."classes" (
  "id"         uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "name"       text                     NOT NULL,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "classes_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."classes"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."profiles" (
  "id"         uuid                     NOT NULL,
  "full_name"  text                     NOT NULL,
  "nim"        text                     NOT NULL,
  "email"      text                     NOT NULL,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "profiles_email_key" UNIQUE (email),
  CONSTRAINT "profiles_nim_key" UNIQUE (nim),
  CONSTRAINT "profiles_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."profiles"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."subjects" (
  "id"         uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "class_id"   uuid                     NOT NULL,
  "name"       text                     NOT NULL,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "subjects_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."subjects"
  ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_class_role (
  _class_id uuid,
  _roles    text[]
)
  RETURNS boolean
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.class_members cm
    WHERE cm.class_id = _class_id
      AND cm.user_id = (SELECT auth.uid())
      AND cm.role = ANY(_roles)
  );
$function$;

CREATE OR REPLACE FUNCTION public.is_class_member (
  _class_id uuid
)
  RETURNS boolean
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.class_members cm
    WHERE cm.class_id = _class_id
      AND cm.user_id = (SELECT auth.uid())
  );
$function$;

CREATE OR REPLACE FUNCTION public.protect_assignment_creator()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SET search_path TO ''
  AS $function$
BEGIN
  IF NEW.created_by IS DISTINCT FROM OLD.created_by
     OR NEW.id IS DISTINCT FROM OLD.id
  THEN
    RAISE EXCEPTION
      'Assignment identity fields cannot be changed';
  END IF;

  NEW.updated_at = NOW();

  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.protect_progress_identity()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SET search_path TO ''
  AS $function$
BEGIN
  IF NEW.student_id IS DISTINCT FROM OLD.student_id
     OR NEW.assignment_id IS DISTINCT FROM OLD.assignment_id
     OR NEW.id IS DISTINCT FROM OLD.id
  THEN
    RAISE EXCEPTION
      'Progress identity fields cannot be changed';
  END IF;

  NEW.updated_at = NOW();

  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.protect_subject_class()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SET search_path TO ''
  AS $function$
BEGIN
  IF NEW.id IS DISTINCT FROM OLD.id
     OR NEW.class_id IS DISTINCT FROM OLD.class_id
  THEN
    RAISE EXCEPTION
      'Subject identity and class cannot be changed';
  END IF;

  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.validate_assignment_subject()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SET search_path TO ''
  AS $function$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM public.subjects s
    WHERE s.id = NEW.subject_id
      AND s.class_id = NEW.class_id
  ) THEN
    RAISE EXCEPTION
      'Assignment subject must belong to the same class';
  END IF;

  RETURN NEW;
END;
$function$;

ALTER TABLE "public"."assignment_progress"
  ADD CONSTRAINT "assignment_progress_student_id_fkey" FOREIGN KEY (student_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE "public"."assignments"
  ADD CONSTRAINT "assignments_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE "public"."assignment_progress"
  ADD CONSTRAINT "assignment_progress_assignment_id_fkey" FOREIGN KEY (assignment_id) REFERENCES public.assignments(id) ON DELETE CASCADE;

ALTER TABLE "public"."assignments"
  ADD CONSTRAINT "assignments_class_id_fkey" FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE CASCADE;

ALTER TABLE "public"."class_members"
  ADD CONSTRAINT "class_members_class_id_fkey" FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE CASCADE;

ALTER TABLE "public"."class_roster"
  ADD CONSTRAINT "class_roster_class_id_fkey" FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE CASCADE;

ALTER TABLE "public"."profiles"
  ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE "public"."class_members"
  ADD CONSTRAINT "class_members_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE "public"."subjects"
  ADD CONSTRAINT "subjects_class_id_fkey" FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE CASCADE;

ALTER TABLE "public"."assignments"
  ADD CONSTRAINT "assignments_subject_id_fkey" FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON DELETE CASCADE;

CREATE TRIGGER protect_assignment_progress_identity
  BEFORE UPDATE ON public.assignment_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_progress_identity();

CREATE TRIGGER protect_assignment_creator
  BEFORE UPDATE ON public.assignments
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_assignment_creator();

CREATE TRIGGER validate_assignment_subject
  BEFORE INSERT OR UPDATE OF class_id, subject_id ON public.assignments
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_assignment_subject();

CREATE TRIGGER protect_subject_class
  BEFORE UPDATE ON public.subjects
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_subject_class();

CREATE POLICY "Students can create their own progress" ON "public"."assignment_progress"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (((student_id = ( SELECT auth.uid() AS uid)) AND (EXISTS ( SELECT 1
   FROM public.assignments a
  WHERE ((a.id = assignment_progress.assignment_id) AND (a.is_active = true) AND public.is_class_member(a.class_id))))));

CREATE POLICY "Students can update their own progress" ON "public"."assignment_progress"
  FOR UPDATE
  TO "authenticated"
  USING ((student_id = ( SELECT auth.uid() AS uid)))
  WITH CHECK (((student_id = ( SELECT auth.uid() AS uid)) AND (EXISTS ( SELECT 1
   FROM public.assignments a
  WHERE ((a.id = assignment_progress.assignment_id) AND (a.is_active = true) AND public.is_class_member(a.class_id))))));

CREATE POLICY "Students can view their own progress" ON "public"."assignment_progress"
  FOR SELECT
  TO "authenticated"
  USING ((student_id = ( SELECT auth.uid() AS uid)));

CREATE POLICY "Class leaders can create assignments" ON "public"."assignments"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((public.has_class_role(class_id, ARRAY['ketua'::text, 'wakil'::text]) AND (EXISTS ( SELECT 1
   FROM public.subjects s
  WHERE ((s.id = assignments.subject_id) AND (s.class_id = assignments.class_id)))) AND (created_by = ( SELECT auth.uid() AS uid))));

CREATE POLICY "Class leaders can delete assignments" ON "public"."assignments"
  FOR DELETE
  TO "authenticated"
  USING (public.has_class_role(class_id, ARRAY['ketua'::text, 'wakil'::text]));

CREATE POLICY "Class leaders can update assignments" ON "public"."assignments"
  FOR UPDATE
  TO "authenticated"
  USING (public.has_class_role(class_id, ARRAY['ketua'::text, 'wakil'::text]))
  WITH CHECK ((public.has_class_role(class_id, ARRAY['ketua'::text, 'wakil'::text]) AND (EXISTS ( SELECT 1
   FROM public.subjects s
  WHERE ((s.id = assignments.subject_id) AND (s.class_id = assignments.class_id))))));

CREATE POLICY "Members can view their assignments" ON "public"."assignments"
  FOR SELECT
  TO "authenticated"
  USING (public.is_class_member(class_id));

CREATE POLICY "Members can view their classes" ON "public"."classes"
  FOR SELECT
  TO "authenticated"
  USING (public.is_class_member(id));

CREATE POLICY "Users can view their own profile" ON "public"."profiles"
  FOR SELECT
  TO "authenticated"
  USING ((id = ( SELECT auth.uid() AS uid)));

CREATE POLICY "Class leaders can create subjects" ON "public"."subjects"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (public.has_class_role(class_id, ARRAY['ketua'::text, 'wakil'::text]));

CREATE POLICY "Class leaders can delete subjects" ON "public"."subjects"
  FOR DELETE
  TO "authenticated"
  USING (public.has_class_role(class_id, ARRAY['ketua'::text, 'wakil'::text]));

CREATE POLICY "Class leaders can update subjects" ON "public"."subjects"
  FOR UPDATE
  TO "authenticated"
  USING (public.has_class_role(class_id, ARRAY['ketua'::text, 'wakil'::text]))
  WITH CHECK (public.has_class_role(class_id, ARRAY['ketua'::text, 'wakil'::text]));

CREATE POLICY "Members can view their subjects" ON "public"."subjects"
  FOR SELECT
  TO "authenticated"
  USING (public.is_class_member(class_id));

REVOKE ALL ON FUNCTION "public"."has_class_role"(uuid, text[]) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION "public"."has_class_role"(uuid, text[]) TO "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."has_class_role"(uuid, text[]) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."has_class_role"(uuid, text[]) TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."has_class_role"(uuid, text[]) TO "service_role";

REVOKE ALL ON FUNCTION "public"."is_class_member"(uuid) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION "public"."is_class_member"(uuid) TO "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."is_class_member"(uuid) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."is_class_member"(uuid) TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."is_class_member"(uuid) TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."protect_assignment_creator"() TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."protect_assignment_creator"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."protect_assignment_creator"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."protect_assignment_creator"() TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."protect_progress_identity"() TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."protect_progress_identity"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."protect_progress_identity"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."protect_progress_identity"() TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."protect_subject_class"() TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."protect_subject_class"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."protect_subject_class"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."protect_subject_class"() TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."validate_assignment_subject"() TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."validate_assignment_subject"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."validate_assignment_subject"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."validate_assignment_subject"() TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."assignment_progress" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."assignment_progress" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."assignment_progress" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."assignment_progress" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."assignments" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."assignments" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."assignments" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."assignments" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."class_members" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."class_members" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."class_members" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."class_members" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."class_roster" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."class_roster" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."class_roster" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."class_roster" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."classes" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."classes" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."classes" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."classes" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profiles" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."profiles" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profiles" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profiles" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."subjects" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."subjects" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."subjects" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."subjects" TO "service_role";
