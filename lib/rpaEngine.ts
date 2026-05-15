let running = false;

/**
 * RPAエンジンが動いているか
 */
export async function isRpaEngineRunning(): Promise<boolean> {
  return running;
}

/**
 * RPAエンジン起動（ダミー版）
 * 本番ではここに Playwright / Nodeプロセス起動を書く
 */
export async function startRpaEngine(): Promise<void> {
  if (running) return;

  console.log("[RPA] Engine starting...");

  // ここに本来は
  // spawn("node", ["rpa-engine/index.js"])
  // などを入れる

  running = true;

  console.log("[RPA] Engine started");
}