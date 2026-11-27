
import { useState, useEffect } from "react";
import { getSubjects } from "../../services/subjectService";
import { supabase } from "../../lib/supabase";
import {
  createAssignment,
  updateAssignment,
} from "../../services/assignmentService";
import { Save, Loader2 } from "lucide-react";

const formControlClass =
  "w-full rounded-lg border border-input-border bg-surface px-3 py-2.5 text-sm text-foreground placeholder:text-muted transition-colors duration-200 motion-reduce:transition-none focus:border-accent focus:ring-2 focus:ring-accent focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-light";

// Mengubah timestamp Supabase menjadi format datetime-local
function toDatetimeLocal(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const offset = date.getTimezoneOffset() * 60_000;

  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export default function AssignmentForm({
  classId,
  onSuccess,
  assignment = null,
}) {
  const isEditMode = Boolean(assignment);

  // State hasil fetching mata kuliah
  const [subjectResult, setSubjectResult] = useState(null);

  const isCurrentSubjectResult =
    Boolean(classId) && subjectResult?.classId === classId;

  const subjects = isCurrentSubjectResult ? subjectResult.data : [];

  const loadingSubjects = Boolean(classId) && !isCurrentSubjectResult;

  const errorSubjects = isCurrentSubjectResult ? subjectResult.error : "";

  // State submit
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // State form
  const [formData, setFormData] = useState(() => ({
    title: assignment?.title ?? "",
    subject_id: assignment?.subject_id ?? "",
    description: assignment?.description ?? "",
    deadline: toDatetimeLocal(assignment?.deadline),
  }));

  // Mengambil daftar mata kuliah
  useEffect(() => {
    if (!classId) return;

    let ignore = false;

    async function fetchSubjects() {
      try {
        const data = await getSubjects(classId);

        if (!ignore) {
          setSubjectResult({
            classId,
            data,
            error: "",
          });
        }
      } catch (error) {
        if (!ignore) {
          setSubjectResult({
            classId,
            data: [],
            error: error.message,
          });
        }
      }
    }

    fetchSubjects();

    return () => {
      ignore = true;
    };
  }, [classId]);

  // Mengubah input
  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // Menyimpan tugas
  async function handleSubmit(e) {
    e.preventDefault();

    if (isSubmitting) return;

    if (!formData.title.trim()) {
      alert("Judul tugas wajib diisi!");
      return;
    }

    if (!formData.subject_id) {
      alert("Mata kuliah wajib dipilih!");
      return;
    }

    if (!formData.deadline) {
      alert("Deadline tugas wajib diisi!");
      return;
    }

    const deadline = new Date(formData.deadline);
    const dateNow = new Date();

    const isDeadlineUnchanged =
      isEditMode && formData.deadline === toDatetimeLocal(assignment.deadline);

    if (
      Number.isNaN(deadline.getTime()) ||
      (!isDeadlineUnchanged && deadline <= dateNow)
    ) {
      alert("Deadline harus berupa tanggal valid di masa depan!");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        throw new Error("Sesi login tidak valid");
      }

      const userId = data.user.id;

      const assignmentData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        subject_id: formData.subject_id,
        class_id: classId,
        deadline: deadline.toISOString(),
        created_by: userId,
      };

      const updates = {
        title: assignmentData.title,
        description: assignmentData.description,
        subject_id: assignmentData.subject_id,
        deadline: isDeadlineUnchanged
          ? assignment.deadline
          : assignmentData.deadline,
      };

      if (isEditMode) {
        await updateAssignment(assignment.id, updates);
      } else {
        await createAssignment(assignmentData);
      }

      onSuccess?.();
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Judul Tugas */}
      <div>
        <label
          htmlFor="assignment-title"
          className="mb-1 block text-sm font-medium text-foreground"
        >
          Judul Tugas
        </label>

        <input
          id="assignment-title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Masukkan judul tugas"
          className={formControlClass}
        />
      </div>

      {/* Mata Kuliah */}
      <div>
        <label
          htmlFor="assignment-subject"
          className="mb-1 block text-sm font-medium text-foreground"
        >
          Mata Kuliah
        </label>

        <select
          id="assignment-subject"
          name="subject_id"
          value={formData.subject_id}
          onChange={handleChange}
          disabled={
            loadingSubjects || Boolean(errorSubjects) || subjects.length === 0
          }
          className={formControlClass}
        >
          <option value="" disabled>
            {loadingSubjects ? "Memuat mata kuliah..." : "Pilih mata kuliah"}
          </option>

          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>

        {errorSubjects && (
          <p className="mt-2 text-sm text-danger">{errorSubjects}</p>
        )}

        {!loadingSubjects && !errorSubjects && subjects.length === 0 && (
          <p className="mt-2 text-sm text-muted">
            Belum ada mata kuliah tersedia.
          </p>
        )}
      </div>

      {/* Deskripsi */}
      <div>
        <label
          htmlFor="assignment-description"
          className="mb-1 block text-sm font-medium text-foreground"
        >
          Deskripsi
        </label>

        <textarea
          id="assignment-description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          placeholder="Masukkan deskripsi tugas"
          className={formControlClass}
        />
      </div>

      {/* Deadline */}
      <div>
        <label
          htmlFor="assignment-deadline"
          className="mb-1 block text-sm font-medium text-foreground"
        >
          Deadline
        </label>

        <input
          id="assignment-deadline"
          type="datetime-local"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          className={formControlClass}
        />
      </div>

      {/* Error submit */}
      {submitError && (
        <p role="alert" className="text-sm text-danger">
          {submitError}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={
          isSubmitting ||
          loadingSubjects ||
          Boolean(errorSubjects) ||
          subjects.length === 0 ||
          !classId
        }
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-medium text-on-primary transition-colors duration-200 motion-reduce:transition-none enabled:hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Loader2
              className="h-4 w-4 animate-spin motion-reduce:animate-none"
              aria-hidden="true"
            />
            <span>Menyimpan...</span>
          </>
        ) : (
          <>
            <Save className="h-4 w-4" aria-hidden="true" />
            <span>{isEditMode ? "Simpan Perubahan" : "Simpan Tugas"}</span>
          </>
        )}
      </button>
    </form>
  );
}
