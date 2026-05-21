import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// =========================
// POST
// =========================
export async function POST(
  req: NextRequest
) {
  try {
    // =========================
    // body取得
    // =========================
    const body = await req.json();

    const {
      name,
      steps,
    } = body;

    // =========================
    // 保存先
    // =========================
    const dataDir = path.join(
      process.cwd(),
      "backend",
      "data"
    );

    const filePath = path.join(
      dataDir,
      "rpa_scenarios.json"
    );

    // =========================
    // dataフォルダ生成
    // =========================
    if (
      !fs.existsSync(dataDir)
    ) {
      fs.mkdirSync(dataDir, {
        recursive: true,
      });

      console.log(
        "[RPA] created dir:",
        dataDir
      );
    }

    // =========================
    // jsonファイル生成
    // =========================
    if (
      !fs.existsSync(filePath)
    ) {
      fs.writeFileSync(
        filePath,
        "[]",
        "utf-8"
      );

      console.log(
        "[RPA] created file:",
        filePath
      );
    }

    // =========================
    // JSON読込
    // =========================
    let scenarios = [];

    try {
      const raw =
        fs.readFileSync(
          filePath,
          "utf-8"
        ) || "[]";

      scenarios =
        JSON.parse(raw);
    } catch (err) {
      console.log(
        "[RPA] json broken -> reset"
      );

      scenarios = [];

      fs.writeFileSync(
        filePath,
        "[]",
        "utf-8"
      );
    }

    // =========================
    // scenario生成
    // =========================
    const scenario = {
      id:
        "rpa_" +
        Date.now() +
        "_" +
        Math.random()
          .toString(16)
          .slice(2),

      name:
        name ||
        "recorded_scenario",

      created_at:
        new Date().toISOString(),

      steps:
        Array.isArray(steps)
          ? steps
          : [],
    };

    // =========================
    // push
    // =========================
    scenarios.push(scenario);

    // =========================
    // 保存
    // =========================
    fs.writeFileSync(
      filePath,
      JSON.stringify(
        scenarios,
        null,
        2
      ),
      "utf-8"
    );

    console.log(
      "[RPA] scenario saved:",
      filePath
    );

    // =========================
    // response
    // =========================
    return NextResponse.json({
      status: "success",
      scenario,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        status: "error",
        message:
          "save failed",
      },
      {
        status: 500,
      }
    );
  }
}