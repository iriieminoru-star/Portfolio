const { chromium } = require("playwright");

const steps = JSON.parse(process.argv[2]);

(async () => {
  const browser = await chromium.launch({
    headless: false
  });

  const page = await browser.newPage();

  for (const step of steps) {
    console.log("STEP:", step);

    if (step.type === "goto") {
      await page.goto(step.url);
    }

    if (step.type === "click") {
      await page.click(step.selector);
    }

    if (step.type === "fill") {
      await page.fill(step.selector, step.value || "");
    }

    if (step.type === "wait") {
      await page.waitForTimeout(step.value || 1000);
    }
  }

  await browser.close();
})();