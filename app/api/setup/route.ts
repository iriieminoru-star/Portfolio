import { NextResponse } from "next/server";
import { ensurePlaywrightInstalled } from "@/lib/ensurePlaywright";
import { startRpaEngine, isRpaEngineRunning } from "@/lib/rpaEngine";

export async function POST() {
  try {
    // =========================
    // 1. Playwright環境確認
    // =========================
    await ensurePlaywrightInstalled();

    // =========================
    // 2. RPA Engine 起動確認
    // =========================
    const alreadyRunning = await isRpaEngineRunning();

    if (!alreadyRunning) {
      await startRpaEngine();
    }

    // =========================
    // 3. 成功レスポンス
    // =========================
    return NextResponse.json({
      status: "success",
      rpa: "ok",
      playwright: "ok",
      engine: alreadyRunning ? "already_running" : "started",
    });
  } catch (error: any) {
    console.error("RPA setup error:", error);

    return NextResponse.json(
      {
        status: "error",
        message: "セットアップ失敗",
        detail: error?.message ?? "unknown error",
      },
      {
        status: 500,
      }
    );
  }
}