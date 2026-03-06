"use client";

import { toaster } from "@/components/ui/toaster";

interface NotifyOptions {
  title: string;
  description?: string;
}

export function notifySuccess(options: NotifyOptions) {
  toaster.success({
    ...options,
    meta: { closable: true },
  });
}

export function notifyError(options: NotifyOptions) {
  toaster.error({
    ...options,
    meta: { closable: true },
  });
}

export function notifyInfo(options: NotifyOptions) {
  toaster.info({
    ...options,
    meta: { closable: true },
  });
}
