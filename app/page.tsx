"use client";

import Link from "next/link";



export default function HomePage() {
  return (
    <main
      style={{
        padding: 40,
        fontFamily: "sans-serif",
        maxWidth: 600,
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: 28, marginBottom: 10 }}>
        No-Code Survey App
      </h1>

      <p style={{ color: "#666", marginBottom: 30 }}>
        フォームを作成して、回答を収集・閲覧できるシンプルなアプリです。
      </p>

      {/* メイン導線（これだけ押せばOK） */}
      {/* ★追加：フォーム作成（メイン導線に昇格） */}
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

      {/* メイン導線 */}
      <Link
        href="/forms"
        style={{
          display: "block",
          padding: 15,
          background: "#000",
          color: "#fff",
          textAlign: "center",
          borderRadius: 8,
          textDecoration: "none",
          marginBottom: 10,
        }}
      >
        フォーム一覧を見る
      </Link>

    </main>
  );
}