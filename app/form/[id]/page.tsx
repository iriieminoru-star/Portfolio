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
  const handleChange = (field_id: string, value: string) => {
    setInputData((prev) => ({
      ...prev,
      [field_id]: value,
    }));
  };

  // ===============
  // 送信（DEBUG強化版）
  // ===============
  const handleSubmit = async () => {
    console.log("================================");
    console.log("🚀 SUBMIT START");
    console.log("================================");

    try {
      setSubmitting(true);
      setError(null);

      // ========================
      // 送信データ確認
      // ========================
      const payload = {
        form_id: id,
        answers: inputData,
      };

      console.log("📦 PAYLOAD:");
      console.log(JSON.stringify(payload, null, 2));

      // ========================
      // API呼び出し
      // ========================
      console.log("🌐 CALL API: submit.php");

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

      // ========================
      // レスポンス（生データ）
      // ========================
      const text = await res.text();

      console.log("📩 RAW RESPONSE:");
      console.log(text);

      let data: SubmitResponse;

      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error("JSONパース失敗: " + text);
      }

      console.log("📩 PARSED RESPONSE:");
      console.log(data);

      // ========================
      // エラーハンドリング
      // ========================
      if (!res.ok) {
        throw new Error(`HTTP ERROR: ${res.status}`);
      }

      if (data.status === "error") {
        throw new Error(data.message);
      }

      // ========================
      // 成功
      // ========================
      console.log("✅ SUBMIT SUCCESS");
      alert("送信成功");

    } catch (err: unknown) {
      console.log("================================");
      console.log("❌ SUBMIT ERROR");
      console.log("================================");

      console.error(err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("通信エラー");
      }

    } finally {
      console.log("================================");
      console.log("🏁 SUBMIT END");
      console.log("================================");

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
