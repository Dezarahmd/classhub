SET local check_function_bodies = off;

REVOKE ALL ON FUNCTION "public"."has_class_role"(uuid, text[]) FROM "anon";

REVOKE ALL ON FUNCTION "public"."is_class_member"(uuid) FROM "anon";
