REVOKE ALL ON TABLE "public"."subjects" FROM "anon";

REVOKE ALL ON TABLE "public"."subjects" FROM "authenticated";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "public"."subjects" TO "authenticated";

