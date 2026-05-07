"use client"

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// =====================
// 型定義
// =====================
type Field = {
  id: string;
  label: string;
  type: string;
};

type FormResponse =
  | {
    status: "success";
    id: string;
    title: string;
    description: string;
    fields: Field[];
  }
  | {
    status: "error";
    message: string;
  };

type SubmitResponse = 
  | {
      status: "success";
    }
  | {
    status: "error";
    message: string;
  };  

// =====================
// ページ
// =====================
export default function FormPage() {
  const params = useParams();
  const id = params.id as string;

  // フォーム情報
  const [form, setForm] = useState<FormResponse | null>(null);
  // 入力データ
  const [inputData, setInputData] = useState<{
    [key: string]: string
  }>({});

  // 読み込み状態
  const [loading, setLoading] = useState<boolean>(true);

  // 送信状態
  const [submitting, setSubmitting] = useState<boolean>(false);

  // エラー
  const [error, setError] = useState<string | null>(null);

  // ===============
  // フォーム取得
  // ===============
  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);

        const res = await fetch(
          `http://localhost/no-code-api/backend/detail.php?id=${id}`
        );
        if (!res.ok) {
          throw new Error("フォーム取得に失敗しました");
        }

        const data: FormResponse = await res.json();

        if (data.status === "error") {
          throw new Error("フォームが存在しません");
        }

        setForm(data);

        // 初期入力生成
        const initialData: { [key: string]: string } = {};

        data.fields.forEach((field) => {
          initialData[field.id] = "";
        });

        setInputData(initialData);
      } catch (err: unknown) {
        console.error(err);

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("取得エラー");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // ===============
  // 入力変更
  // ===============
  const handleChange = (fieldId: string, value: string) => {
    setInputData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  // ===============
  // 送信
  // ===============
  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);

      const res = await fetch(
        "http://localhost/no-code-api/backend/submit.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            formId: id,
            answers: inputData,
          }),
        }
      );

      const data: SubmitResponse = await res.json();

      if (data.status === "error") {
        throw new Error(data.message);
      }

      alert("送信成功");

    } catch (err: unknown) {
      console.error(err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("通信エラー");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ===============
  // 表示
  // ===============
  if (loading) {
    return <p>読み込み中...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!form || form.status === "error") {
    return <p>フォームが存在しません</p>;
  }

  return (
    <main style={{ padding: "20px" }}>
      <h1>{form.title}</h1>

      <p>{form.description}</p>

      <hr />

      {form.fields.map((field) => (
        <div
          key={field.id}
          style={{ marginBottom: "15px" }}
        >
          <label
            style={{
              display: "block",
              marginBottom: "5px",
            }}
          >
            {field.label}
          </label>

          {/* text */}
          {field.type === "text" && (
            <input
              value={inputData[field.id] || ""}
              onChange={(e) =>
                handleChange(field.id, e.target.value)
              }
              style={{
                padding: "8px",
                width: "300px",
              }}
            />
          )}

          {/* number */}
          {field.type === "number" && (
            <input
              type="number"
              value={inputData[field.id] || ""}
              onChange={(e) =>
                handleChange(field.id, e.target.value)
              }
            />
          )}
        </div>
      ))}
      <button
        onClick={handleSubmit}
        disabled={submitting}
      >
        {submitting ? "送信中。。。" : "送信"}
      </button>
    </main>
  );
}
