REVOKE ALL ON TABLE "public"."assignments" FROM "anon";

REVOKE ALL ON TABLE "public"."assignments" FROM "authenticated";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "public"."assignments" TO "authenticated";

