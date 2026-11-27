
import { useEffect, useState } from "react";
import { useMembership } from "../contexts/MembershipContext";
import {
  getAssignments,
  softDeleteAssignment,
} from "../services/assignmentService";
import Modal from "../components/ui/Modal";
import AssignmentForm from "../components/assignments/AssignmentForm";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  CalendarDays,
} from "lucide-react";

const buttonBaseClass =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

const primaryButtonClass =
  `${buttonBaseClass} bg-primary text-on-primary enabled:hover:bg-primary-hover`;

const secondaryButtonClass =
  `${buttonBaseClass} border border-input-border bg-surface text-foreground enabled:hover:bg-primary-light`;

const dangerButtonClass =
  `${buttonBaseClass} bg-danger text-white enabled:hover:bg-red-700`;

const iconButtonClass =
  "inline-flex cursor-pointer items-center justify-center rounded-lg p-2 text-muted transition-colors duration-200 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2";

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
      <h1 className="text-3xl font-bold text-foreground">
        Daftar Tugas
      </h1>

      <p className="text-muted">
        Kelola dan pantau tugas perkuliahanmu di sini.
      </p>

      {canManageTasks && (
        <button
          type="button"
          className={primaryButtonClass}
          onClick={handleAddAssignment}
        >
          <Plus size={16} aria-hidden="true" />
          Tambah Tugas
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
                className={secondaryButtonClass}
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className={dangerButtonClass}
              >
                {isDeleting ? (
                  <>
                    <Loader2
                      className="h-4 w-4 animate-spin motion-reduce:animate-none"
                      aria-hidden="true"
                    />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <span>Ya, Hapus</span>
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

      {loading && (
        <p className="text-muted">Memuat daftar tugas...</p>
      )}

      {errorMessage && (
        <p className="text-danger">{errorMessage}</p>
      )}

      {!loading &&
        !errorMessage &&
        displayedAssignments.length === 0 && (
          <p className="text-muted">
            Belum ada tugas tersedia.
          </p>
        )}

      {!loading &&
        !errorMessage &&
        displayedAssignments.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {displayedAssignments.map((task) => (
              <article
                key={task.id}
                className="flex min-w-0 flex-col rounded-xl border border-border bg-surface p-5 shadow-sm"
              >
                {/* Identitas tugas */}
                <div className="min-w-0">
                  <h2 className="break-words text-lg font-semibold text-foreground">
                    {task.title}
                  </h2>

                  <p className="mt-1 break-words text-sm text-muted">
                    {task.subjectName}
                  </p>
                </div>

                {/* Informasi deadline */}
                <div className="mt-4 flex items-start gap-2 text-sm text-muted">
                  <CalendarDays
                    size={16}
                    className="mt-0.5 shrink-0"
                    aria-hidden="true"
                  />

                  <p>
                    Deadline:{" "}
                    {new Date(task.deadline).toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                      timeZone: "Asia/Jakarta",
                    })}
                  </p>
                </div>

                {/* Footer tugas */}
                <div className="mt-auto pt-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                    <div className="flex flex-wrap items-center gap-2">
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
                    </div>

                    {canManageTasks && (
                      <div className="ml-auto flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleEditAssignment(task)}
                          aria-label={`Edit tugas ${task.title}`}
                          className={`${iconButtonClass} hover:bg-primary-light hover:text-primary-hover`}
                        >
                          <Pencil
                            className="h-4 w-4"
                            aria-hidden="true"
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteClick(task)}
                          aria-label={`Hapus tugas ${task.title}`}
                          className={`${iconButtonClass} hover:bg-danger-light hover:text-danger`}
                        >
                          <Trash2
                            className="h-4 w-4"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
    </section>
  );
}
