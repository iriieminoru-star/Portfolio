import { chromium } from "playwright";

type Action =
  | { type: "click"; selector: string }
  | { type: "input"; selector: string; value: string };

export async function replayRPA(actions: Action[]) {
  console.log("[REPLAY] START");

  const browser = await chromium.launch({
    headless: false,
  });

  const page = await browser.newPage();

  await page.goto("http://localhost:3000/");

  for (const action of actions) {
    console.log("[REPLAY]", action);

    if (action.type === "click") {
      await page.click(action.selector);
    }

    if (action.type === "input") {
      await page.fill(action.selector, action.value);
    }
  }

  console.log("[REPLAY] DONE");
}