SET local check_function_bodies = off;

REVOKE ALL ON TABLE "public"."class_roster" FROM "anon";

CREATE OR REPLACE FUNCTION public.protect_roster_class_id()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SET search_path TO ''
  AS $function$
BEGIN
    IF NEW.class_id IS DISTINCT FROM OLD.class_id THEN
        RAISE EXCEPTION
            'Roster class_id cannot be changed';
    END IF;

    RETURN NEW;
END;
$function$;

REVOKE ALL ON FUNCTION "public"."protect_roster_class_id"() FROM PUBLIC, "anon", "authenticated";

CREATE TRIGGER protect_class_roster_class_id
  BEFORE UPDATE ON public.class_roster
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_roster_class_id();

CREATE POLICY "Class leaders can delete roster" ON "public"."class_roster"
  FOR DELETE
  TO "authenticated"
  USING (public.has_class_role(class_id, ARRAY['ketua'::text, 'wakil'::text]));

CREATE POLICY "Class leaders can insert roster" ON "public"."class_roster"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (public.has_class_role(class_id, ARRAY['ketua'::text, 'wakil'::text]));

CREATE POLICY "Class leaders can update roster" ON "public"."class_roster"
  FOR UPDATE
  TO "authenticated"
  USING (public.has_class_role(class_id, ARRAY['ketua'::text, 'wakil'::text]))
  WITH CHECK (public.has_class_role(class_id, ARRAY['ketua'::text, 'wakil'::text]));

CREATE POLICY "Class leaders can view roster" ON "public"."class_roster"
  FOR SELECT
  TO "authenticated"
  USING (public.has_class_role(class_id, ARRAY['ketua'::text, 'wakil'::text]));

REVOKE ALL ON FUNCTION "public"."protect_roster_class_id"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."protect_roster_class_id"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."protect_roster_class_id"() TO "service_role";

REVOKE ALL ON TABLE "public"."class_roster" FROM "authenticated";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "public"."class_roster" TO "authenticated";

