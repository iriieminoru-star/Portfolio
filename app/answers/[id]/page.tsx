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
  const { id } = use(params);

  const [answers, setAnswers] = useState<Answer[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/answers.php?form_id=${id}`)
      .then(async (res) => {
        const text = await res.text();
        return JSON.parse(text);
      })
      .then((data) => {
        if (data.status === "error") {
          throw new Error(data.message);
        }

        setAnswers(data.answers);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [id]);

  return (
    <main
      data-rpa-id="page-answers-root"
      style={{ padding: "20px" }}
    >
      <h1 data-rpa-id="page-answers-title">
        回答一覧
      </h1>

      {error && (
        <p data-rpa-id="page-answers-error" style={{ color: "red" }}>
          {error}
        </p>
      )}

      {answers.length === 0 && !error && (
        <p data-rpa-id="page-answers-empty">
          回答なし
        </p>
      )}

      {answers.map((answer) => (
        <div
          key={answer.id}
          data-rpa-id={`page-answers-item-${answer.id}`}
          style={{
            border: "1px solid #ccc",
            marginBottom: "10px",
            padding: "10px",
          }}
        >
          {/* 質問タイトル */}
          <p data-rpa-id={`page-answers-item-${answer.id}-title`}>
            質問: {answer.title}
          </p>

          {/* 回答値 */}
          <p data-rpa-id={`page-answers-item-${answer.id}-value`}>
            回答: {answer.value}
          </p>

          {/* 日時 */}
          <p data-rpa-id={`page-answers-item-${answer.id}-date`}>
            日時: {answer.created_at}
          </p>

          {/* 削除ボタン */}
          <button
            data-rpa-id={`page-answers-item-${answer.id}-delete`}
            onClick={async () => {
              const ok = confirm("回答を削除しますか？");
              if (!ok) return;

              const res = await fetch(
                "/api/answers/delete",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    id: answer.id,
                  }),
                }
              );

              const data = await res.json();

              if (data.status === "success") {
                setAnswers((prev) =>
                  prev.filter((a) => a.id !== answer.id)
                );
              } else {
                alert(data.message);
              }
            }}
            style={{
              marginTop: 10,
              color: "red",
              fontWeight: "bold",
            }}
          >
            削除
          </button>
        </div>
      ))}
    </main>
  );
}