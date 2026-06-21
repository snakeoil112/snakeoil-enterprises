import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("workspace smoke", () => {
  it("loads the root package manifest", () => {
    const pkg = JSON.parse(readFileSync("package.json", "utf8"));

    expect(pkg.name).toBe("snakeoil-enterprises");
    expect(pkg.workspaces).toEqual(["apps/*", "packages/*"]);
  });

  it("exposes dev tooling scripts", () => {
    const pkg = JSON.parse(readFileSync("package.json", "utf8"));

    expect(pkg.scripts.lint).toBeDefined();
    expect(pkg.scripts.format).toBeDefined();
    expect(pkg.scripts.test).toBeDefined();
    expect(pkg.scripts.verify).toBeDefined();
    expect(pkg.scripts["ci:verify"]).toBeDefined();
  });
});
