SET local check_function_bodies = off;

REVOKE ALL ON FUNCTION "public"."protect_assignment_creator"() FROM "anon";

REVOKE ALL ON FUNCTION "public"."protect_assignment_creator"() FROM "authenticated";

REVOKE ALL ON FUNCTION "public"."protect_subject_class"() FROM "anon";

REVOKE ALL ON FUNCTION "public"."protect_subject_class"() FROM "authenticated";

REVOKE ALL ON FUNCTION "public"."validate_assignment_subject"() FROM "anon";

REVOKE ALL ON FUNCTION "public"."validate_assignment_subject"() FROM "authenticated";

DROP POLICY "Class leaders can delete assignments" ON "public"."assignments";

ALTER TABLE "public"."assignments"
  DROP CONSTRAINT "assignments_subject_id_fkey";

CREATE OR REPLACE FUNCTION public.protect_assignment_creator()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
BEGIN
    IF NEW.id IS DISTINCT FROM OLD.id
       OR NEW.class_id IS DISTINCT FROM OLD.class_id
    THEN
        RAISE EXCEPTION
            'Assignment identity fields cannot be changed';
    END IF;

    IF NEW.created_by IS DISTINCT FROM OLD.created_by THEN
        IF NOT (
            NEW.created_by IS NULL
            AND OLD.created_by IS NOT NULL
            AND NOT EXISTS (
                SELECT 1
                FROM auth.users u
                WHERE u.id = OLD.created_by
            )
        ) THEN
            RAISE EXCEPTION
                'Assignment creator cannot be changed';
        END IF;
    END IF;

    NEW.updated_at = NOW();

    RETURN NEW;
END;
$function$;

ALTER TABLE "public"."assignments"
  ADD CONSTRAINT "assignments_subject_id_fkey" FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON DELETE RESTRICT;

REVOKE ALL ON FUNCTION "public"."protect_assignment_creator"() FROM PUBLIC;

REVOKE ALL ON FUNCTION "public"."protect_subject_class"() FROM PUBLIC;

REVOKE ALL ON FUNCTION "public"."validate_assignment_subject"() FROM PUBLIC;

REVOKE ALL ON TABLE "public"."assignments" FROM "authenticated";

GRANT INSERT, SELECT, UPDATE ON TABLE "public"."assignments" TO "authenticated";

