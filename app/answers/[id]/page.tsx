"use client";

import { use } from "react";
import { useEffect, useState } from "react";

type Answer = {
  id: number;
  form_id: string;
  field_id: string;
  value: string;
  created_at: string;
  title: string;
};

const API_BASE = "http://localhost/no-code-api/backend";

export default function AnswersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  // ★ Promiseを展開
  const { id } = use(params);

  const [answers, setAnswers] = useState<Answer[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {

    console.log("id =", id);

    fetch(`${API_BASE}/answers.php?form_id=${id}`)
      .then(async (res) => {

        const text = await res.text();

        console.log("RAW =", text);

        return JSON.parse(text);

      })
      .then((data) => {

        console.log("DATA =", data);

        if (data.status === "error") {
          throw new Error(data.message);
        }

        setAnswers(data.answers);

      })
      .catch((err) => {

        console.error(err);

        setError(err.message);

      });

  }, [id]);

  return (
    <main style={{ padding: "20px" }}>

      <h1>回答一覧</h1>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {answers.length === 0 && !error && (
        <p>回答なし</p>
      )}

      {answers.map((answer) => (

        <div
          key={answer.id}
          style={{
            border: "1px solid #ccc",
            marginBottom: "10px",
            padding: "10px",
          }}
        >

          <p>質問: {answer.title}</p>

          <p>回答: {answer.value}</p>

          <p>日時: {answer.created_at}</p>

        </div>

      ))}

    </main>
  );
}