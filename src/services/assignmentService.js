import { supabase } from "../lib/supabase";

export async function getAssignments(classId) {
  const { data, error } = await supabase
    .from("assignments")
    .select(
      `*, subjects (
            id,
            name
        ), 
        assignment_progress (
            status
        )
        `,
    )
    .eq("class_id", classId)
    .eq("is_active", true)
    .order("deadline", { ascending: true });

  if (error) {
    throw error;
  }

  const normalizedData = data.map((assignment) => {
    return {
        ...assignment,
        subjectName: assignment.subjects?.name ?? "Mata kuliah tidak tersedia",
        progress: assignment.assignment_progress?.[0]?.status ?? "not_started"
    }
  })

  return normalizedData;
}

export async function createAssignment(assignmentData) {
  const {data, error} = await supabase
    .from("assignments")
    .insert(assignmentData)
    .select()
    .single()

  if (error) throw error

  return data
}

export async function updateAssignment(assignmentId, updates) {
  const {data, error} = await supabase
    .from("assignments")
    .update(updates)
    .eq("id", assignmentId)
    .eq("is_active", true)
    .select()
    .single()

    if (error) throw error

    return data
}