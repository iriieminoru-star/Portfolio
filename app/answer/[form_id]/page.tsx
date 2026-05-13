// testcode
// export default function Page() {
//   return <h1>Answer Page</h1>;
// }
"use client";

import { use, useEffect, useState } from "react";

type Field = {
  id: string;
  label: string;
  type: string;
};

type FormData = {
  id: string;
  title: string;
  fields: Field[];
};

export default function Page(
  {
    params,
  } : {
    params: Promise<{ form_id: string }>;
  }
) {
  // URLパラメータ取得
  const { form_id } = use(params);
  // フォーム情報
  const [form, setForm] = useState<FormData | null>(null);
  // フォーム取得
  useEffect(() => {
    fetch(
      `http://localhost/no-code-api/backend/forms.php?id=${form_id}`
    )
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      setForm(data.form)
    });
  }, [form_id]);

  // ローディング
  if (!form) {
    return <p>Loading...</p>;
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>{form.title}</h1>
      {form.fields.map((field) => (
        <div
          key={field.id}
          style={{ marginBottom: 20 }}
        >
          <p>{field.label}</p>
          <input type="text" />
        </div>
      ))}
    </main>
  );
}
