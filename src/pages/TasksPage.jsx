import { useEffect, useState } from "react";
import { useMembership } from "../contexts/MembershipContext";
import { getAssignments } from "../services/assignmentService";
import Modal from "../components/ui/Modal";
import AssignmentForm from "../components/assignments/AssignmentForm";
import { Pencil } from "lucide-react";

export default function TasksPage() {
  const membership = useMembership();
  const classId = membership?.class_id;
  const role = membership?.role;
  const canManageTasks = role === "ketua" || role === "wakil";
  const [assignment, setAssignment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const displayedAssignments = assignment;

  function handleEditAssignment(task) {
    setSelectedAssignment(task);
    setIsFormOpen(true);
  }

  function handleAddAssignment() {
    setSelectedAssignment(null);
    setIsFormOpen(true);
  }

  function handleAssignmentCreated() {
    setIsFormOpen(false);
    setRefreshKey((prev) => prev + 1);
  }

  useEffect(() => {
    let ignore = false;
    if (!classId) return;

    async function fetchAssignment() {
      setLoading(true);
      setErrorMessage("");

      try {
        const data = await getAssignments(classId);
        if (!ignore) {
          setAssignment(data);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    fetchAssignment();
    return () => {
      ignore = true;
    };
  }, [classId, refreshKey]);

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold text-slate-900">Daftar Tugas</h1>

      <p className="text-slate-500">
        Kelola dan pantau tugas perkuliahanmu di sini.
      </p>

      {canManageTasks && (
        <button
          className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 font-medium"
          onClick={handleAddAssignment}
        >
          + Tambah Tugas
        </button>
      )}

      {canManageTasks && (
        <Modal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          title={selectedAssignment ? "Edit Tugas" : "Tambah Tugas Baru"}
        >
          <AssignmentForm classId={classId} onSuccess={handleAssignmentCreated} assignment={selectedAssignment}>
            Form tambah tugas akan tampil disini
          </AssignmentForm>
        </Modal>
      )}

      {loading && <p className="text-slate-500">Memuat daftar tugas...</p>}

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      {!loading && !errorMessage && displayedAssignments.length === 0 && (
        <p className="text-slate-500">Belum ada tugas tersedia.</p>
      )}

      {!loading && !errorMessage && displayedAssignments.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {displayedAssignments.map((task) => (
            <div
              key={task.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {task.title}
              </h3>
              <p className="mt-1 text-sm text-slate-500">{task.subjectName}</p>
              <p className="mt-3 text-sm text-slate-600">
                Deadline:{" "}
                {new Date(task.deadline).toLocaleString("id-ID", {
                  dateStyle: "medium",
                  timeStyle: "short",
                  timeZone: "Asia/Jakarta",
                })}
              </p>
              <p className="mt-4">
                {task.progress === "not_started" && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    Belum Dikerjakan
                  </span>
                )}
                {task.progress === "in_progress" && (
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                    Sedang Dikerjakan
                  </span>
                )}
                {task.progress === "completed" && (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    Selesai
                  </span>
                )}
              </p>
              {canManageTasks && (
                  <button
                    type="button"
                    onClick={() => handleEditAssignment(task)}
                    aria-label={`Edit tugas ${task.title}`}
                    className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
