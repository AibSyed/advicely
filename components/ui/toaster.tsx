"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from "react-icons/fi";
import { cn } from "@/lib/utils/cn";

type ToastTone = "success" | "error" | "info";

interface ToastInput {
  title: string;
  description?: string;
  tone: ToastTone;
}

interface ToastRecord extends ToastInput {
  id: string;
}

type Listener = () => void;

const listeners = new Set<Listener>();
let toastState: ToastRecord[] = [];

function emitChange() {
  listeners.forEach((listener) => {
    listener();
  });
}

function subscribe(listener: Listener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return toastState;
}

function dismissToast(id: string) {
  toastState = toastState.filter((toast) => toast.id !== id);
  emitChange();
}

function pushToast(input: ToastInput) {
  const toast: ToastRecord = {
    ...input,
    id: crypto.randomUUID(),
  };

  toastState = [toast, ...toastState].slice(0, 3);
  emitChange();

  window.setTimeout(() => {
    dismissToast(toast.id);
  }, 3600);
}

export const toaster = {
  success(input: Omit<ToastInput, "tone">) {
    pushToast({ ...input, tone: "success" });
  },
  error(input: Omit<ToastInput, "tone">) {
    pushToast({ ...input, tone: "error" });
  },
  info(input: Omit<ToastInput, "tone">) {
    pushToast({ ...input, tone: "info" });
  },
  dismiss: dismissToast,
};

function ToastIcon({ tone }: { tone: ToastTone }) {
  if (tone === "success") {
    return <FiCheckCircle aria-hidden="true" />;
  }

  if (tone === "error") {
    return <FiAlertCircle aria-hidden="true" />;
  }

  return <FiInfo aria-hidden="true" />;
}

function ToastItem({ toast }: { toast: ToastRecord }) {
  useEffect(() => {
    return () => {
      dismissToast(toast.id);
    };
  }, [toast.id]);

  return (
    <div className={cn("toast-card", `toast-card--${toast.tone}`)} role="status" aria-live="polite">
      <div className="toast-card__icon" aria-hidden="true">
        <ToastIcon tone={toast.tone} />
      </div>
      <div className="toast-card__content">
        <p className="toast-card__title">{toast.title}</p>
        {toast.description ? <p className="toast-card__description">{toast.description}</p> : null}
      </div>
      <button
        type="button"
        className="toast-card__close"
        onClick={() => dismissToast(toast.id)}
        aria-label="Dismiss notification"
      >
        <FiX aria-hidden="true" />
      </button>
    </div>
  );
}

export function AppToaster() {
  const toasts = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div className="toast-layer" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>,
    document.body,
  );
}
