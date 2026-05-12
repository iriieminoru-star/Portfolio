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

  // useEffect(() => {
  //   fetch(`${API_BASE}/forms.php`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (data.status === "error") {
  //         throw new Error(data.message);
  //       }
  //       setForms(data.forms);
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       setError("フォーム取得失敗")
  //     });
  // }, []);

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
          <p>{form.title}</p>
          <p>{form.created_at}</p>

          <Link href={`/answers/${form.id}`}>
            回答を見る
          </Link>
        </div>
      ))}
    </main>
  )
}