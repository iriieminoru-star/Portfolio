"use client";

import { useState } from "react";

// ===== START: CreatePage =====
export default function CreatePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost/no-code-api/save.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
        }),
      });

      const data = await res.json();

      if (data.status === "success") {
        alert("保存成功");

        setTitle("")
        setDescription("")

        console.log(data);
      } else {
        alert("失敗");
      }
    } catch (err) {
      console.error(err);
      alert("通信エラー");
    }
  };

  return (
    <main style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>フォーム作成</h1>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="フォーム名"
        style={{ display: "block", marginBottom: "10px" }}
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="説明"
        style={{ display: "block", marginBottom: "10px" }}
      />

      <button onClick={handleSubmit}>
        保存
      </button>

      <hr />

      <p>フォーム名: {title}</p>
      <p>説明: {description}</p>
    </main>
  );
}
// ===== END: CreatePage =====