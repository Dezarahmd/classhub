import { supabase } from "../lib/supabase";

export async function getSubjects(classId) {
    const {data, error} = await supabase
        .from("subjects")
        .select("id, name")
        .eq("class_id", classId)
        .order("name", {ascending: true})

    if (error) {
        throw error
    }

    return data
}