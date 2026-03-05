import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const targets = ["README.md", "docs/architecture.md"];
const unsafeLabelPattern = /\[[^"\]\n]*(?:\/|\(|\)|\[|\])[^"\]\n]*\]/;

for (const target of targets) {
  const text = readFileSync(resolve(target), "utf8");
  const blocks = [...text.matchAll(/```mermaid\n([\s\S]*?)```/g)].map((match) => match[1]);

  if (blocks.length === 0) {
    console.error(`No Mermaid blocks found in ${target}`);
    process.exit(1);
  }

  for (const [index, block] of blocks.entries()) {
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
    if (!lines[0] || !(lines[0].startsWith("flowchart") || lines[0].startsWith("sequenceDiagram"))) {
      console.error(`Mermaid block ${index + 1} in ${target} must start with flowchart or sequenceDiagram`);
      process.exit(1);
    }

    for (const line of lines) {
      if (unsafeLabelPattern.test(line)) {
        console.error(`Unsafe Mermaid label in ${target} block ${index + 1}: ${line}`);
        process.exit(1);
      }
    }
  }
}

console.log("Mermaid validation passed for README and architecture docs.");
