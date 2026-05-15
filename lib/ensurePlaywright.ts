import fs from "fs";
import path from "path";
import { execSync } from "child_process";

export function ensurePlaywrightInstalled() {

  const modulePath = path.join(
    process.cwd(),
    "node_modules",
    "playwright"
  );

  const browserPath = path.join(
    process.cwd(),
    "node_modules",
    "playwright-core"
  );

  try {

    if (!fs.existsSync(modulePath)) {

      console.log("npm install playwright 実行開始");

      console.log("Playwright 未導入 → install開始");

      execSync("npm install playwright --save", {
        stdio: "inherit",
      });
    }

    if (!fs.existsSync(browserPath)) {

      console.log("ブラウザ未導入 → playwright install開始");

      execSync("npx playwright install", {
        stdio: "inherit",
      });
    }

    console.log("Playwright セットアップ完了");

  } catch (error) {

    console.error("Playwright セットアップ失敗", error);

    throw error;
  }
}