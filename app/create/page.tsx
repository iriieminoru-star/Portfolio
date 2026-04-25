// ===== START: createページ =====

// ===== START: フォーム入力UI =====

"use client";

import { useState } from "react";

export default function CreatePage() {
  // フォーム名
  const [title, setTitle] = useState("");

  // 説明
  const [description, setDescription] = useState("");

  return (
    <main style={{ padding: "20px", fontFamily: "sans-serif" }}>

      <h1>フォーム作成</h1>

      {/* フォーム名を入力 */}
      <div style={{ marginBottom: "10px" }}>
        <label>フォーム名</label><br />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "300px", padding: "5px" }}
        />
      </div>

      {/* 説明入力 */}
      <div style={{ marginBottom: "10px" }}>
        <label>説明</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: "300px", height: "100px", padding: "5px" }}
        />
      </div>

      <hr />

      {/* 入力確認（デバッグ用） */}
      <h2>入力内容確認</h2>
      <p>フォーム名：{title}</p>
      <p>説明：{description}</p>

      <p>ここでフォームを作成します（未実装）</p>
    </main>
  );
}

// ===== END: createページ =====