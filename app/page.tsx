"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
/**
 * =========================================
 * Top Page
 * =========================================
 * No-Code Survey App のホーム画面
 *
 * このページでは：
 * - フォーム作成
 * - フォーム一覧表示
 * を行う
 *
 * 将来的には：
 * - 条件分岐フォーム
 * - ログイン
 * - 回答分析
 * - ダッシュボード
 * などを追加予定
 * =========================================
 */
type Form = {
  id: string;
  title: string;
  description: string;
  created_at: string;
};

// =====================
// Home Page
// =====================
export default function HomePage() {
  const [forms, setForms] = useState<any[]>([]);
  const [loading, setLoading] =useState(true); 
  const [error, setError] = useState<string | null>(null);

  // =====================
  // フォーム取得
  // =====================
  useEffect(() => {
    const fetchforms = async () => {
      try {
        setError(null);

        const res = await fetch(
          "http://localhost/no-code-api/backend/get_forms.php"
        );

        const data = await res.json();

        if (data.status === "success") {
          setForms(data.forms);
        } else {
          throw new Error(data.message || "取得失敗");
        }
      } catch (err: any) {
        setError(err.message || "通信エラー");
      } finally {
        setLoading(false);
      }
    };
    fetchforms();
  }, []);

  return (
    <main
      style={{
        padding: 40,
        fontFamily: "sans-serif",
        maxWidth: 600,
        margin: "0 auto",
      }}
    >

      {/* =========================================
          タイトルエリア
      ========================================= */}

      <h1 style={{ fontSize: 28, marginBottom: 10}}>
        No-Code Survey App
      </h1>

      <p style={{ color: "#666", marginBottom: 30 }}>
        フォームを作成して回答を収集できます。
      </p>

      {/* =========================================
          フォーム作成ボタン
      ========================================= */}
      <Link
        href="/create"
        style={{
          display: "block",
          padding: 15,
          background: "#2563eb",
          color: "#fff",
          textAlign: "center",
          borderRadius: 8,
          textDecoration: "none",
          marginBottom: 10,
          fontWeight: "bold",
        }}
      >
        ＋ フォームを作成する
      </Link>

      {/* =========================================
          状態表示
      ========================================= */}
      {loading && <p>読み込み中...</p>}
      {error && <p style={{ color: "red"}}>{error}</p>}

      {/* =====================
          フォーム一覧
      ===================== */}
      {!loading && !error && (
        <>
          <h2 style={{ marginBottom: 15}}>フォーム一覧</h2>
          {forms.length === 0 &&(
            <p style={{ color: "#888" }}>
              まだフォームがありません
            </p>
          )}

          {forms.map((form) => (
            <div
              key={form.id}
              style={{
                border: "1px solid #ddd",
                padding: 15,
                borderRadius: 8,
                marginBottom: 12,
                background: "#fff",
              }}
            >
              <h3 style={{ marginBottom: 5 }}>{form.title}</h3>
              <p style={{ color: "#666", marginBottom: 10}}>
                {form.description}
              </p>

              <p style={{ fontSize: 12, color: "#999" }}>
                作成日： {form.created_at}
              </p>
              <div style={{ marginTop: 10}}>
                <Link
                  href={`/answers/${form.id}`}
                  style={{
                    color: "#2563eb",
                    textDecoration: "none",
                    fontWeight: "blod",
                  }}
                  >
                    回答を見る
                  </Link>
              </div>
            </div>
          ))}
        </>
      )}
    </main>
  );
}