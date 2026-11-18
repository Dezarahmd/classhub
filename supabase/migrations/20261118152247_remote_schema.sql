SET local check_function_bodies = off;

REVOKE ALL ON FUNCTION "public"."protect_progress_identity"() FROM "anon";

REVOKE ALL ON FUNCTION "public"."protect_progress_identity"() FROM "authenticated";

REVOKE ALL ON TABLE "public"."assignment_progress" FROM "anon";

DROP POLICY "Students can update their own progress" ON "public"."assignment_progress";

DROP POLICY "Students can view their own progress" ON "public"."assignment_progress";

CREATE POLICY "Students can update their own progress" ON "public"."assignment_progress"
  FOR UPDATE
  TO "authenticated"
  USING (((student_id = ( SELECT auth.uid() AS uid)) AND (EXISTS ( SELECT 1
   FROM public.assignments a
  WHERE ((a.id = assignment_progress.assignment_id) AND (a.is_active = true) AND public.is_class_member(a.class_id))))))
  WITH CHECK (((student_id = ( SELECT auth.uid() AS uid)) AND (EXISTS ( SELECT 1
   FROM public.assignments a
  WHERE ((a.id = assignment_progress.assignment_id) AND (a.is_active = true) AND public.is_class_member(a.class_id))))));

CREATE POLICY "Students can view their own progress" ON "public"."assignment_progress"
  FOR SELECT
  TO "authenticated"
  USING (((student_id = ( SELECT auth.uid() AS uid)) AND (EXISTS ( SELECT 1
   FROM public.assignments a
  WHERE ((a.id = assignment_progress.assignment_id) AND public.is_class_member(a.class_id))))));

REVOKE ALL ON FUNCTION "public"."protect_progress_identity"() FROM PUBLIC;

REVOKE ALL ON TABLE "public"."assignment_progress" FROM "authenticated";

GRANT INSERT, SELECT, UPDATE ON TABLE "public"."assignment_progress" TO "authenticated";

