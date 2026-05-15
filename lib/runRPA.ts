import { chromium } from "playwright";

// =====================
// RPA本体
// =====================

export async function runRPA() {
  try {
    console.log("RPA START");

    const browser = await chromium.launch({
      headless: false,
    });

    const page = await browser.newPage();

    // =====================
    // 元URL（ここがポイント）
    // =====================
    const targetUrl = "http://localhost:3000/";

    await page.goto(targetUrl);

    await page.screenshot({
      path: "localhost-top.png",
    });

    await page.waitForTimeout(5000);

    // =====================
    // ★追加：元のURLに戻る
    // =====================
    await page.goto(targetUrl);

    await browser.close();

    console.log("RPA SUCCESS");
  } catch (err) {
    console.error("RPA ERROR", err);
    throw err;
  }
}