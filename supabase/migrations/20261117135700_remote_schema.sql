REVOKE ALL ON TABLE "public"."profiles" FROM "anon";

REVOKE ALL ON TABLE "public"."profiles" FROM "authenticated";

GRANT SELECT ON TABLE "public"."profiles" TO "authenticated";
