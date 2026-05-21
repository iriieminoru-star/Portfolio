let forms: any[] = [];

export async function GET() {
  return Response.json({
    status: "success",
    forms,
  });
}

export async function POST(req: Request) {
  const body = await req.json();

  const newForm = {
    id: crypto.randomUUID(),
    title: body.title,
    description: body.description,

    // 🔥 これが重要
    fields: body.fields || [],
  };

  forms.push(newForm);

  return Response.json({
    status: "success",
    ...newForm,
  });
}