import { useState, useEffect } from "react";
import { getSubjects } from "../../services/subjectService";
import { supabase } from "../../lib/supabase";
import { createAssignment } from "../../services/assignmentService";
import { Save, Loader2 } from "lucide-react";

export default function AssignmentForm({ classId, onSuccess }) {
  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [errorSubjects, setErrorSubjects] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    subject_id: "",
    description: "",
    deadline: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.title.trim()) {
      alert("Judul tugas wajib diisi!");
      return;
    }

    if (!formData.subject_id) {
      alert("Mata kuliah wajib dipilih");
      return;
    }

    if (!formData.deadline) {
      alert("Deadline tugas wajib diisi!");
      return;
    }

    const deadline = new Date(formData.deadline);
    const dateNow = new Date();

    if (Number.isNaN(deadline.getTime()) || deadline <= dateNow) {
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
        deadline: new Date(formData.deadline).toISOString(),
        created_by: userId,
      };
      await createAssignment(assignmentData);
      onSuccess?.()
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  useEffect(() => {
    if (!classId) {
      setSubjects([]);
      setLoadingSubjects(false);
      setErrorSubjects("");

      setFormData((prev) => ({
        ...prev,
        subject_id: "",
      }));

      return;
    }

    let ignore = false;

    setLoadingSubjects(true);
    setErrorSubjects("");
    setSubjects([]);

    setFormData((prev) => ({
      ...prev,
      subject_id: "",
    }));

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

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Masukkan judul tugas"
        className="w-full rounded-lg border border-slate-500 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        rows={4}
        placeholder="Masukkan deskripsi tugas"
      />
      <input
        type="datetime-local"
        name="deadline"
        value={formData.deadline}
        onChange={handleChange}
      />
      <select
        name="subject_id"
        value={formData.subject_id}
        onChange={handleChange}
        disabled={
          loadingSubjects || Boolean(errorSubjects) || subjects.length === 0
        }
        className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-100"
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
        <p className="mt-2 text-sm text-slate-500">Belum ada mata kuliah</p>
      )}

      {submitError && <p className="text-sm text-red-500">{submitError}</p>}

      <button
        type="submit"
        disabled={
          isSubmitting ||
          loadingSubjects ||
          Boolean(errorSubjects) ||
          subjects.length === 0 ||
          !classId
        }
        className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Menyimpan...</span>
          </>
        ) : (
          <>
            <span>Simpan Tugas</span>
            <Save className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}
