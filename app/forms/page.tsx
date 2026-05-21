"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Form = {
  id: string;
  title: string;
  created_at: string;
};

const API_BASE = "http://localhost/no-code-api/backend";

export default function FormsPage() {
  const [forms, setForms] = useState<Form[]>([]);
  const [error, setError] = useState("");

  // ==============================
  // フォーム一覧取得
  // ==============================
  useEffect(() => {
    fetch(`${API_BASE}/forms.php`)
      .then(async (res) => {
        const text = await res.text();
        return JSON.parse(text);
      })
      .then((data) => {
        if (data.status === "error") {
          throw new Error(data.message);
        }

        if (!Array.isArray(data.forms)) {
          throw new Error("formsデータ不正");
        }

        setForms(data.forms);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  return (
    <main
      data-rpa-id="page-forms-root"
      style={{ padding: 20 }}
    >
      <h1 data-rpa-id="page-forms-title">
        フォーム一覧
      </h1>

      {error && (
        <p data-rpa-id="page-forms-error" style={{ color: "red" }}>
          {error}
        </p>
      )}

      {forms.map((form) => (
        <div
          key={form.id}
          data-rpa-id={`page-forms-item-${form.id}`}
          style={{
            border: "1px solid #ccc",
            padding: 10,
            marginBottom: 10,
          }}
        >
          {/* タイトル */}
          <p data-rpa-id={`page-forms-item-${form.id}-title`}>
            {form.title}
          </p>

          {/* 作成日時 */}
          <p data-rpa-id={`page-forms-item-${form.id}-created`}>
            {form.created_at}
          </p>

          <div
            data-rpa-id={`page-forms-item-${form.id}-actions`}
            style={{
              display: "flex",
              gap: 10,
              marginTop: 10,
            }}
          >
            {/* 回答入力 */}
            <Link
              href={`/answer/${form.id}`}
              data-rpa-id={`page-forms-item-${form.id}-answer`}
            >
              回答する
            </Link>

            {/* 回答一覧 */}
            <Link
              href={`/answers/${form.id}`}
              data-rpa-id={`page-forms-item-${form.id}-answers`}
            >
              回答を見る
            </Link>
          </div>
        </div>
      ))}
    </main>
  );
}