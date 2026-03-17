const browserWindow =
  globalThis.window ??
  (globalThis.document ? (globalThis.document as Document).defaultView : null);

if (!browserWindow) {
  throw new Error("Happy DOM window is not available in the test environment.");
}

globalThis.setTimeout = browserWindow.setTimeout;
globalThis.clearTimeout = browserWindow.clearTimeout;
globalThis.setInterval = browserWindow.setInterval;
globalThis.clearInterval = browserWindow.clearInterval;
globalThis.requestAnimationFrame = browserWindow.requestAnimationFrame;
globalThis.cancelAnimationFrame = browserWindow.cancelAnimationFrame;
globalThis.queueMicrotask = browserWindow.queueMicrotask;
