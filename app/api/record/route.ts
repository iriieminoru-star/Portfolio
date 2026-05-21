import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data/rpa.json");

// 状態取得
async function load() {
  return JSON.parse(await fs.readFile(filePath, "utf-8"));
}

async function save(data: any) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// =====================
// START RECORDING
// =====================
export async function POST() {
  const data = await load();

  data.recording = true;

  await save(data);

  return Response.json({
    status: "success",
    recording: true,
  });
}

// =====================
// STOP RECORDING
// =====================
export async function DELETE() {
  const data = await load();

  data.recording = false;

  await save(data);

  return Response.json({
    status: "success",
    recording: false,
  });
}

// =====================
// GET STATUS
// =====================
export async function GET() {
  const data = await load();

  return Response.json({
    status: "success",
    ...data,
  });
}