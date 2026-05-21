import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data/forms.json");

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const text = await fs.readFile(filePath, "utf-8");
  const forms = JSON.parse(text || "[]");

  const form = forms.find((f: any) => f.id === id);

  if (!form) {
    return Response.json({
      status: "error",
      message: "not found",
    });
  }

  return Response.json({
    status: "success",
    ...form,
  });
}