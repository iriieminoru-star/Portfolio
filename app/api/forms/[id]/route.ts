import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    // =========================
    // id取得
    // =========================

    const { id } = await params;

    console.log("DELETE ID =", id);

    // =========================
    // PHP API呼び出し
    // =========================

    const res = await fetch(
      "http://localhost/no-code-api/backend/delete_form.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          form_id: id,
        }),
      }
    );

    // =========================
    // 生レスポンス確認
    // =========================

    const text = await res.text();

    console.log("DELETE RAW =", text);

    // =========================
    // JSON変換
    // =========================

    const data = JSON.parse(text);

    return NextResponse.json(data);

  } catch (err: any) {

    console.error(err);

    return NextResponse.json(
      {
        status: "error",
        message: err.message,
      },
      { status: 500 }
    );
  }
}