"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RPAPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const router = useRouter();

  const runRPA = async () => {
    try {
      setLoading(true);
      setMessage("RPA実行中...");

      const res = await fetch("/api/rpa/run", {
        method: "POST",
      });

      const data = await res.json();

      if (data.status === "success") {
        setMessage("RPA実行完了");

        // =================================
        // ⭐追加：ホームへ戻る
        // =================================
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        setMessage("RPA失敗: " + data.message);
      }
    } catch (err) {
      setMessage("RPA実行エラー");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: 40, maxWidth: 700, margin: "0 auto" }}>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>
        RPA管理画面
      </h1>

      <p style={{ color: "#666", marginBottom: 30 }}>
        localhost:3000 を自動操作します
      </p>

      <div
        style={{
          padding: 15,
          background: "#f3f4f6",
          borderRadius: 8,
        }}
      >
        実行URL: http://localhost:3000
      </div>

      <button
        onClick={runRPA}
        disabled={loading}
        style={{
          marginTop: 20,
          padding: "14px 24px",
          background: "#7c3aed",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? "実行中..." : "RPA実行"}
      </button>

      <p style={{ marginTop: 20 }}>{message}</p>
    </main>
  );
}