"use client"

import { use, useEffect, useState } from "react";


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

  const { id } = use(params);

  const [answers, setAnswers] = useState<Answer[]>([]);
  const [error, setError] = useState("");

  function formatBalue(value: string) {
    switch (value) {
      case "-1":
        return "反対";
      case: "0";
        return "中立";
      case: "1";
        return "賛成";
      default:
        return "value"
    }
  }

  useEffect(() => {

    fetch(
      `${API_BASE}/answers.php?form_id=${id}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        if (data.status === "error") {
          throw new Error(data.message);
        }

        setAnswers(data.answers);

      })
      .catch((err) => {
        // console.error(err);
        // setError("回答取得失敗");
        console.error("回答取得エラー", err);

        // if (err instanceof Error) {
        //   setError(err.message);
        // } else {
        //   setError("回答取得失敗")
        // }
        setError("回答取得失敗")
      });

  }, [id]);

  return (
    <main style={{ padding: "200px" }}>
      <h1>回答一覧</h1>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
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
          <p>ID: {answer.id}</p>

          <p>フォームID: {answer.form_id}</p>

          <p>質問: {answer.title}</p>

          <p>回答: {formatValue(answer.value)}</p>

          <p>作成日時: {answer.created_at}</p>

        </div>

      ))}

    </main>
  );
}
