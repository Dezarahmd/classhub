import { X } from "lucide-react";
import { useEffect, useRef, useId } from "react";
import { createPortal } from "react-dom";

export default function Modal({ isOpen, onClose, title, children }) {
  const modalRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
      }
      if (e.key === "Tab") {
        const focusableElement = Array.from(
          modalRef.current?.querySelectorAll(
            'input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex]:not([tabindex="-1"]), button:not(:disabled)',
          ) ?? [],
        ).filter((element) => {
          return (
            element.getClientRects().length > 0 &&
            getComputedStyle(element).visibility === "visible" &&
            element.tabIndex >= 0 &&
            !element.matches(":disabled")
          );
        });

        if (!focusableElement?.length) {
          e.preventDefault();
          return;
        }

        const firstElement = focusableElement[0];
        const lastElement = focusableElement[focusableElement.length - 1];
        const activeElement = document.activeElement;

        if (
          activeElement === modalRef.current ||
          !modalRef.current.contains(activeElement)
        ) {
          e.preventDefault();
          if (e.shiftKey) {
            lastElement.focus();
          } else {
            firstElement.focus();
          }
          return;
        }

        if (!e.shiftKey && activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }

        if (e.shiftKey && activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const previousActiveElement = document.activeElement;
    modalRef.current?.focus();

    return () => {
      previousActiveElement?.focus?.();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-surface p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
        role="dialog"
        tabIndex={-1}
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground" id={titleId}>
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup Modal"
            className="rounded-lg p-2 text-muted transition-colors hover:bg-primary-light hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <X size={20} />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
