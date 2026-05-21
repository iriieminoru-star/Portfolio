type Item = {
  id: string;
  title: string;
  description: string;
};

let forms: Item[] = [];

export async function GET() {
  return Response.json({
    status: "success",
    forms,
  });
}

export async function POST(req: Request) {
  const body = await req.json();

  const newForm: Item = {
    id: crypto.randomUUID(),
    title: body.title,
    description: body.description,
  };

  forms.push(newForm);

  return Response.json({
    status: "success",
    ...newForm,
  });
}