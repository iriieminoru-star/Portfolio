"use client"

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

  // =========================================
  // フォーム一覧取得
  // =========================================
  useEffect(() => {
    fetch(`${API_BASE}/forms.php`)
      .then(async (res) => {
        console.log("STATUS:", res.status);
        const text = await res.text();
        console.log("RAW:", text);
        return JSON.parse(text);
      })
      .then((data) => {
        console.log("DATA:", data);
        // APIエラー
        if (data.status === "error") {
          throw new Error(data.message);
        }

        // forms存在確認
        if (!Array.isArray(data.forms)) {
          throw new Error("formsデータ不正");
        }
        
        setForms(data.forms);
      })
      .catch((err) => {
        console.error("FETCH ERROR:", err);
        setError(err.message);
      });
  }, []);

  return (
    <main style={{ padding: 20 }}>
      <h1>フォーム一覧</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {forms.map((form) => (
        <div
          key={form.id}
          style={{
            border: "1px solid #ccc",
            padding: 10,
            marginBottom: 10,
          }}
        >
          {/* タイトル */}
          <p>{form.title}</p>
          {/* 作成日時 */}
          <p>{form.created_at}</p>

          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 10,
            }}
          >
          {/* 回答入力 */}
          <Link href={`/answer/${form.id}`}>
            回答する
          </Link>

          {/* 回答一覧 */}
          <Link href={`/answers/${form.id}`}>
            回答を見る
          </Link>
          </div>
        </div>
      ))}
    </main>
  );
}