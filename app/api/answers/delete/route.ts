export async function POST(
  req: Request
) {
  try {

    const body =
      await req.json();

    const res = await fetch(
      "http://localhost/no-code-api/backend/delete_answer.php",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          id: body.id,
        }),
      }
    );

    const data =
      await res.json();

    return Response.json(data);

  } catch (err: any) {

    return Response.json({
      status: "error",
      message: err.message,
    });
  }
}