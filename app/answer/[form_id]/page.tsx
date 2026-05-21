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

export default function Page({
  params,
}: {
  params: Promise<{ form_id: string }>;
}) {
  const { form_id } = use(params);

  const [form, setForm] = useState<FormData | null>(null);

  // =====================
  // フォーム取得
  // =====================
  useEffect(() => {
    fetch(
      `http://localhost/no-code-api/backend/forms.php?id=${form_id}`
    )
      .then((res) => res.json())
      .then((data) => {
        setForm(data.form);
      });
  }, [form_id]);

  // =====================
  // loading
  // =====================
  if (!form) {
    return (
      <p data-rpa-id="page-answer-loading">
        Loading...
      </p>
    );
  }

  return (
    <main
      data-rpa-id="page-answer-root"
      style={{ padding: 20 }}
    >
      <h1 data-rpa-id="page-answer-title">
        {form.title}
      </h1>

      {form.fields.map((field) => (
        <div
          key={field.id}
          data-rpa-id={`page-answer-field-${field.id}`}
          style={{ marginBottom: 20 }}
        >
          {/* ラベル */}
          <p data-rpa-id={`page-answer-field-${field.id}-label`}>
            {field.label}
          </p>

          {/* 入力 */}
          <input
            data-rpa-id={`page-answer-field-${field.id}-input`}
            type="text"
          />
        </div>
      ))}
    </main>
  );
}