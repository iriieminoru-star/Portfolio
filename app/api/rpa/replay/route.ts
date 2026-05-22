import { NextRequest, NextResponse } from "next/server";
import { replayRPA } from "@/lib/replayRPA";

// =========================
// POST /api/rpa/replay
// body: { steps: Step[], delay?: number }
// フロントエンドから受け取ったシナリオを Playwright で再生する
// =========================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { steps, delay } = body;

    if (!Array.isArray(steps)) {
      return NextResponse.json(
        { status: "error", message: "steps が配列ではありません" },
        { status: 400 }
      );
    }

    // delay が未指定または不正な値の場合は 500ms をデフォルトにする
    const delayMs =
      typeof delay === "number" && delay >= 0 ? delay : 500;

    console.log("[API /rpa/replay] steps:", steps.length, "delay:", delayMs);

    // Step 型 → replayRPA の Action 型に変換
    // （"input" → "input", "click" → "click"、"goto" は除外）
    const actions = steps
      .filter((s: any) => s.type === "click" || s.type === "input")
      .map((s: any) => {
        if (s.type === "click") {
          return { type: "click" as const, selector: s.selector };
        }
        return { type: "input" as const, selector: s.selector, value: s.value };
      });

    // Playwright 再生（delay 付き）
    await replayRPA(actions, delayMs);

    console.log("[API /rpa/replay] done");

    return NextResponse.json({ status: "success" });
  } catch (error: any) {
    console.error("[API /rpa/replay] error:", error);

    return NextResponse.json(
      {
        status: "error",
        message: error?.message || "Playwright 再生中にエラーが発生しました",
      },
      { status: 500 }
    );
  }
}
