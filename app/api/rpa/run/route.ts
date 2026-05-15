import { NextResponse } from "next/server";

// =====================
// RPA本体
// =====================

import { runRPA } from "@/lib/runRPA";

// =====================
// POST
// =====================

export async function POST() {

  console.log("");
  console.log("=================================");
  console.log("RPA API START");
  console.log("=================================");

  try {

    // =====================
    // RPA実行
    // =====================

    console.log("[API] runRPA 呼び出し");

    await runRPA();

    console.log("[API] runRPA 成功");

    console.log("=================================");
    console.log("RPA API SUCCESS");
    console.log("=================================");
    console.log("");

    // =====================
    // 成功レスポンス
    // =====================

    return NextResponse.json({
      status: "success",
    });

  } catch (error: any) {

    // =====================
    // エラーログ
    // =====================

    console.error("");
    console.error("=================================");
    console.error("RPA API ERROR");
    console.error("=================================");

    console.error(error);

    console.error("message =", error?.message);

    console.error("stack =", error?.stack);

    console.error("=================================");
    console.error("");

    // =====================
    // フロントへ返却
    // =====================

    return NextResponse.json(
      {
        status: "error",

        // 本当のエラー内容を返す
        message:
          error?.message ||
          "RPA失敗",
      },
      {
        status: 500,
      }
    );
  }
}