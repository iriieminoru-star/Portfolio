"use client"

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// ==== 型 ====
type Field = {
  id: string;
  label: string;
  type: string;
}

type Form = {
  title: string;
  fields: Field[];
};

export default function FormPage() {
  const params = useParams();
  const id = params.id as string;

  const [form, setForm] = useState<Form | null>(null);
  const [inputData, setInputData] = useState<{ [key: string]: string }>({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ===============
  // データ取得
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

        const data: Form = await res.json();

        setForm(data);

        const init: { [key: string]: string } = {};

        data.fields?.forEach((f) => {
          init[f.id] = "";
        });

        setInputData(init);
      } catch (err: unknown) {
        console.error(err);

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("フォーム取得に失敗しました");
        }
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
      setLoading(true);
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

      const data = await res.json();

      if (!res.ok || data.status === "error") {
        throw new Error(data.message || "送信に失敗しました");
      }

      alert("送信成功");

    } catch (err: unknown) {
      console.error(err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("通信エラー");
      }
    };

    // ===============
    // 表示
    // ===============
    if (error) return <p style={{ color: "red" }}></p>;
    if (!form) return <p>読み込み中...</p>;

    return (
      <main style={{ padding: 20 }}>
        <h1>{form.title}</h1>

        {form.fields.map((field) => (
          <div key={field.id} style={{ marginBottom: 10 }}>
            <label>{field.label}</label>

            {field.type === "text" && (
              <input
                value={inputData[field.id] || ""}
                onChange={(e) =>
                  handleChange(field.id, e.target.value)
                }
              />
            )}

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
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "送信中。。。" : "送信"}
        </button>
      </main>
    );
  }
}