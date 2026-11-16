CREATE POLICY "Users can view their own memberships" ON "public"."class_members"
  FOR SELECT
  TO "authenticated"
  USING ((user_id = ( SELECT auth.uid() AS uid)));

