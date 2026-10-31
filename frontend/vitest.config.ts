import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["src/lib/**/*.ts"],
      exclude: [
        "src/lib/api*.ts",
        "src/lib/admin-api.ts",
        "src/lib/api-base.ts",
        "src/lib/auth-session.ts",
        "src/lib/constants.ts",
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        statements: 70,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
