"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

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

export default function FormPage() {
  const params = useParams();
  const id = params.id as string;

  const [form, setForm] = useState<FormResponse | null>(null);
  const [inputData, setInputData] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // =====================
  // フォーム取得
  // =====================
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

        const initialData: { [key: string]: string } = {};
        data.fields.forEach((field) => {
          initialData[field.id] = "";
        });

        setInputData(initialData);
      } catch (err: any) {
        setError(err.message || "取得エラー");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // =====================
  // 入力変更
  // =====================
  const handleChange = (field_id: string, value: string) => {
    setInputData((prev) => ({
      ...prev,
      [field_id]: value,
    }));
  };

  // =====================
  // 送信
  // =====================
  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        form_id: id,
        answers: inputData,
      };

      const res = await fetch(
        "http://localhost/no-code-api/backend/submit.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const text = await res.text();
      const data: SubmitResponse = JSON.parse(text);

      if (!res.ok) throw new Error(`HTTP ERROR: ${res.status}`);
      if (data.status === "error") throw new Error(data.message);

      alert("送信成功");
    } catch (err: any) {
      setError(err.message || "通信エラー");
    } finally {
      setSubmitting(false);
    }
  };

  // =====================
  // UI
  // =====================
  if (loading) {
    return (
      <p data-rpa-id="page-form-loading">
        読み込み中...
      </p>
    );
  }

  if (error) {
    return (
      <p data-rpa-id="page-form-error" style={{ color: "red" }}>
        {error}
      </p>
    );
  }

  if (!form || form.status === "error") {
    return (
      <p data-rpa-id="page-form-not-found">
        フォームが存在しません
      </p>
    );
  }

  return (
    <main
      data-rpa-id="page-form-root"
      style={{ padding: "20px" }}
    >
      <h1 data-rpa-id="page-form-title">
        {form.title}
      </h1>

      <p data-rpa-id="page-form-description">
        {form.description}
      </p>

      <hr />

      {form.fields.map((field) => (
        <div
          key={field.id}
          data-rpa-id={`page-form-field-${field.id}`}
          style={{ marginBottom: "15px" }}
        >
          <label
            data-rpa-id={`page-form-field-${field.id}-label`}
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
              data-rpa-id={`page-form-field-${field.id}-input`}
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
              data-rpa-id={`page-form-field-${field.id}-number`}
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
        data-rpa-id="page-form-submit-button"
        onClick={handleSubmit}
        disabled={submitting}
      >
        {submitting ? "送信中..." : "送信"}
      </button>
    </main>
  );
}