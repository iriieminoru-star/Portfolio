import { chromium } from "playwright";

type Action =
  | { type: "click"; selector: string }
  | { type: "input"; selector: string; value: string };

/**
 * Playwright でシナリオを再生する
 * @param actions 再生するステップの配列
 * @param delayMs ステップ間の待機ミリ秒（デフォルト 500ms）
 *                速度スライダーの値がここに渡される
 */
export async function replayRPA(actions: Action[], delayMs: number = 500) {
  console.log("[REPLAY] START  delay:", delayMs, "ms  steps:", actions.length);

  const browser = await chromium.launch({
    headless: false, // 実際のブラウザウィンドウを表示（マウス移動が見える）
  });

  const page = await browser.newPage();

  await page.goto("http://localhost:3000/");

  for (const action of actions) {
    console.log("[REPLAY]", action);

    // ステップ間に指定された遅延を挿入（人間らしい操作速度を再現）
    await page.waitForTimeout(delayMs);

    try {
      if (action.type === "click") {
        // hover してからクリック → マウスが要素に近づく動きを再現
        await page.hover(action.selector);
        await page.waitForTimeout(Math.floor(delayMs * 0.3)); // クリック前に少し待つ
        await page.click(action.selector);
      }

      if (action.type === "input") {
        // フォーカス → クリア → 1文字ずつ入力（人間らしいタイピングを再現）
        await page.click(action.selector);
        await page.fill(action.selector, ""); // 既存テキストをクリア
        await page.type(action.selector, action.value, {
          // delay: 1文字ごとの入力間隔（delayMs の 1/10 程度）
          delay: Math.max(30, Math.floor(delayMs / 10)),
        });
      }
    } catch (err) {
      // selector が見つからない等のエラーはスキップして続行
      console.warn("[REPLAY] step error, skip:", action.selector, err);
    }
  }

  console.log("[REPLAY] DONE");

  // 再生後しばらく待ってからブラウザを閉じる
  await page.waitForTimeout(1000);
  await browser.close();
}
