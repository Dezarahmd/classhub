REVOKE ALL ON TABLE "public"."classes" FROM "anon";

REVOKE ALL ON TABLE "public"."classes" FROM "authenticated";

GRANT SELECT ON TABLE "public"."classes" TO "authenticated";
