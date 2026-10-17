import { readFileSync } from "node:fs";
import { describe, expect, test } from "bun:test";

describe("action metadata", () => {
  test("should expose the conclusion output from the run step", () => {
    const metadata = readFileSync(
      new URL("../action.yml", import.meta.url),
      "utf8",
    );

    expect(metadata).toMatch(
      /^  conclusion:\n    description: .+\n    value: \$\{\{ steps\.run\.outputs\.conclusion \}\}$/m,
    );
  });

  test("should declare timeout_minutes and hand it to the run step as INPUT_TIMEOUT_MINUTES", () => {
    const metadata = readFileSync(
      new URL("../action.yml", import.meta.url),
      "utf8",
    );

    expect(metadata).toMatch(/^  timeout_minutes:\n    description: .+$/m);
    expect(metadata).toMatch(
      /^ {8}INPUT_TIMEOUT_MINUTES: \$\{\{ inputs\.timeout_minutes \}\}$/m,
    );
  });

  test("should pass INPUT_TIMEOUT_MINUTES from the entrypoint to runClaude", () => {
    const entrypoint = readFileSync(
      new URL("../src/entrypoints/run.ts", import.meta.url),
      "utf8",
    );

    expect(entrypoint).toContain(
      "timeoutMinutes: process.env.INPUT_TIMEOUT_MINUTES",
    );
  });
});
