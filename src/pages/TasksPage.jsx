import { useEffect, useState } from "react";
import { useMembership } from "../contexts/MembershipContext";
import {
  getAssignments,
  softDeleteAssignment,
} from "../services/assignmentService";
import Modal from "../components/ui/Modal";
import AssignmentForm from "../components/assignments/AssignmentForm";
import { Pencil, Trash2, Loader2 } from "lucide-react";

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
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const displayedAssignments = assignment;

  function handleDeleteClick(task) {
    setSelectedAssignment(task);
    setIsDeleteOpen(true);
    setDeleteError("");
  }

  function handleCancelDelete() {
    if (isDeleting) return;
    setIsDeleteOpen(false);
    setSelectedAssignment(null);
  }

  async function handleConfirmDelete() {
    if (!selectedAssignment || !canManageTasks || isDeleting) return;
    setIsDeleting(true);
    setDeleteError("");

    try {
      await softDeleteAssignment(selectedAssignment.id);
      setIsDeleteOpen(false);
      setSelectedAssignment(null);
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      setDeleteError(error.message);
    } finally {
      setIsDeleting(false);
    }
  }

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
      <h1 className="text-3xl font-bold text-foreground">Daftar Tugas</h1>

      <p className="text-muted">
        Kelola dan pantau tugas perkuliahanmu di sini.
      </p>

      {canManageTasks && (
        <button
          className="rounded-lg bg-primary text-on-primary px-4 py-2 hover:bg-primary-hover font-medium"
          onClick={handleAddAssignment}
        >
          + Tambah Tugas
        </button>
      )}

      {canManageTasks && (
        <div>
          <Modal
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            title={selectedAssignment ? "Edit Tugas" : "Tambah Tugas Baru"}
          >
            <AssignmentForm
              classId={classId}
              onSuccess={handleAssignmentCreated}
              assignment={selectedAssignment}
            >
              Form tambah tugas akan tampil disini
            </AssignmentForm>
          </Modal>

          <Modal
            isOpen={isDeleteOpen}
            onClose={handleCancelDelete}
            title="Hapus tugas"
          >
            <p>
              Apakah kamu yakin ingin menghapus tugas{" "}
              <strong>"{selectedAssignment?.title}"</strong>
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancelDelete}
                disabled={isDeleting}
                className="rounded-lg bg-neutral-light px-4 py-2 text-neutral-foreground hover:bg-border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-danger px-4 py-2 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <span>Ya, Hapus</span>
                  </>
                )}
              </button>
            </div>
            {deleteError && (
              <p role="alert" className="mt-3 text-sm text-danger">
                {deleteError}
              </p>
            )}
          </Modal>
        </div>
      )}

      {loading && <p className="text-muted">Memuat daftar tugas...</p>}

      {errorMessage && <p className="text-danger">{errorMessage}</p>}

      {!loading && !errorMessage && displayedAssignments.length === 0 && (
        <p className="text-muted">Belum ada tugas tersedia.</p>
      )}

      {!loading && !errorMessage && displayedAssignments.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {displayedAssignments.map((task) => (
            <div
              key={task.id}
              className="rounded-xl border border-border bg-surface p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-foreground">
                {task.title}
              </h3>
              <p className="mt-1 text-sm text-muted">{task.subjectName}</p>
              <p className="mt-3 text-sm text-muted">
                Deadline:{" "}
                {new Date(task.deadline).toLocaleString("id-ID", {
                  dateStyle: "medium",
                  timeStyle: "short",
                  timeZone: "Asia/Jakarta",
                })}
              </p>
              <p className="mt-4">
                {task.progress === "not_started" && (
                  <span className="rounded-full bg-neutral-light px-3 py-1 text-xs font-medium text-neutral-foreground">
                    Belum Dikerjakan
                  </span>
                )}
                {task.progress === "in_progress" && (
                  <span className="rounded-full bg-info-light px-3 py-1 text-xs font-medium text-info">
                    Sedang Dikerjakan
                  </span>
                )}
                {task.progress === "completed" && (
                  <span className="rounded-full bg-success-light px-3 py-1 text-xs font-medium text-success">
                    Selesai
                  </span>
                )}
              </p>
              {canManageTasks && (
                <>
                  <button
                    type="button"
                    onClick={() => handleEditAssignment(task)}
                    aria-label={`Edit tugas ${task.title}`}
                    className="rounded-lg p-2 text-muted hover:bg-primary-light hover:text-primary-hover transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteClick(task)}
                    aria-label={`Hapus tugas ${task.title}`}
                    className="rounded-lg p-2 text-muted hover:bg-danger-light hover:text-danger transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
