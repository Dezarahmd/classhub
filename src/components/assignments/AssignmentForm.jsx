import { useState, useEffect } from "react";
import { getSubjects } from "../../services/subjectService";
import { supabase } from "../../lib/supabase";
import {
  createAssignment,
  updateAssignment,
} from "../../services/assignmentService";
import { Save, Loader2 } from "lucide-react";

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

  // State mata kuliah
  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [errorSubjects, setErrorSubjects] = useState("");

  // State submit
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // State form
  const [formData, setFormData] = useState({
    title: "",
    subject_id: "",
    description: "",
    deadline: "",
  });

  // Mengisi form saat Edit, reset saat Create
  useEffect(() => {
    if (isEditMode) {
      setFormData({
        title: assignment.title ?? "",
        subject_id: assignment.subject_id ?? "",
        description: assignment.description ?? "",
        deadline: toDatetimeLocal(assignment.deadline),
      });
    } else {
      setFormData({
        title: "",
        subject_id: "",
        description: "",
        deadline: "",
      });
    }

    setSubmitError("");
  }, [assignment, isEditMode]);

  // Mengambil daftar mata kuliah
  useEffect(() => {
    if (!classId) {
      setSubjects([]);
      setLoadingSubjects(false);
      setErrorSubjects("");
      return;
    }

    let ignore = false;

    setLoadingSubjects(true);
    setErrorSubjects("");
    setSubjects([]);

    async function fetchSubjects() {
      try {
        const data = await getSubjects(classId);

        if (!ignore) {
          setSubjects(data);
        }
      } catch (error) {
        if (!ignore) {
          setErrorSubjects(error.message);
        }
      } finally {
        if (!ignore) {
          setLoadingSubjects(false);
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

  // Menyimpan tugas baru
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
          className="mb-1 block text-sm font-medium text-slate-700"
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
          className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Mata Kuliah */}
      <div>
        <label
          htmlFor="assignment-subject"
          className="mb-1 block text-sm font-medium text-slate-700"
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
          className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100"
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
          <p className="mt-2 text-sm text-red-500">{errorSubjects}</p>
        )}

        {!loadingSubjects && !errorSubjects && subjects.length === 0 && (
          <p className="mt-2 text-sm text-slate-500">
            Belum ada mata kuliah tersedia.
          </p>
        )}
      </div>

      {/* Deskripsi */}
      <div>
        <label
          htmlFor="assignment-description"
          className="mb-1 block text-sm font-medium text-slate-700"
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
          className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Deadline */}
      <div>
        <label
          htmlFor="assignment-deadline"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Deadline
        </label>

        <input
          id="assignment-deadline"
          type="datetime-local"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Error submit */}
      {submitError && (
        <p role="alert" className="text-sm text-red-500">
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
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Menyimpan...</span>
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            <span>{isEditMode ? "Simpan Perubahan" : "Simpan Tugas"}</span>
          </>
        )}
      </button>
    </form>
  );
}
