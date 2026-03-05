import { rmSync } from "node:fs";
import { resolve } from "node:path";

const targets = [".next/types", ".next/dev/types"];

for (const target of targets) {
  rmSync(resolve(target), { recursive: true, force: true });
}

console.log("Cleaned Next.js generated type directories.");
