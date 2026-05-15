import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

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

    const data = await res.json();

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      {
        status: "error",
        message: "delete failed",
      },
      { status: 500 }
    );
  }
}