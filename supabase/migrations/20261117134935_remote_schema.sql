REVOKE ALL ON TABLE "public"."class_members" FROM "anon";

REVOKE ALL ON TABLE "public"."class_members" FROM "authenticated";

GRANT SELECT ON TABLE "public"."class_members" TO "authenticated";

