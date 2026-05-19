export async function POST(req: Request) {
  try {

    console.log("=================================");
    console.log("DELETE FORM API START");
    console.log("=================================");

    // ================================
    // body取得
    // ================================

    const body = await req.json();

    console.log(
      "REQUEST BODY =",
      body
    );

    // ================================
    // id取得
    // ================================

    const id = body.id;

    console.log(
      "DELETE TARGET ID =",
      id
    );

    // ================================
    // PHP API呼び出し
    // ================================

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

    // ================================
    // 生レスポンス
    // ================================

    const text = await res.text();

    console.log(
      "PHP RAW RESPONSE =",
      text
    );

    // ================================
    // JSON変換
    // ================================

    const data = JSON.parse(text);

    console.log(
      "DELETE RESULT =",
      data
    );

    return Response.json(data);

  } catch (err: any) {

    console.error(
      "DELETE API ERROR =",
      err
    );

    return Response.json({
      status: "error",
      message: err.message,
    });
  }
}