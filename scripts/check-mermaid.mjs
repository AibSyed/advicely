import { readFileSync } from "node:fs";

const text = readFileSync(new URL("../README.md", import.meta.url), "utf8");
const blocks = [...text.matchAll(/```mermaid\n([\s\S]*?)```/g)].map((match) => match[1]);

if (blocks.length === 0) {
  console.error("No Mermaid blocks found in README.md");
  process.exit(1);
}

const unsafeLabelPattern = /\[[^"\]\n]*(?:\/|\(|\)|\[|\])[^"\]\n]*\]/;

for (const [index, block] of blocks.entries()) {
  const lines = block
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines[0]?.startsWith("flowchart")) {
    console.error(`Mermaid block ${index + 1} must start with flowchart`);
    process.exit(1);
  }

  for (const line of lines) {
    if (unsafeLabelPattern.test(line)) {
      console.error(`Unsafe Mermaid label detected in block ${index + 1}: ${line}`);
      console.error("Use quoted labels, e.g. RH[\"/app/api/discovery Route Handler\"]");
      process.exit(1);
    }
  }
}

console.log(`Mermaid validation passed for ${blocks.length} block(s).`);
