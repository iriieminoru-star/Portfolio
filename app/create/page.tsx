"use client";

import { useEffect, useState } from "react";

// ===== 型定義 =====
type FormData = {
  title: string;
  description: string;
}

type SaveResponse = {
  status: string;
  title: string;
  description: string;
}

// ===== START: CreatePage =====
export default function CreatePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [list, setList] = useState<FormData[]>([]);

  useEffect(() => {
    fetch("http://localhost/no-code-api/list.php")
      .then((res) => res.json())
      .then((data: FormData[]) => {
        setList(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

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

      // ★型を付ける
      const data: SaveResponse = await res.json();

      if (data.status === "success") {
        alert("保存成功");

        // 一覧に追加
        setList((prev) => [
          ...prev,
          {
            title: data.title,
            description: data.description,
          },
        ]);

        // 入力クリア
        setTitle("");
        setDescription("");
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

      <button onClick={handleSubmit}>保存</button>

      <hr />

      {/* ★★ 一覧表示 */}
      <h2>保存一覧</h2>

      {list.length === 0 ? (
        <p>まだデータがありません</p>
      ) : (
        list.map((item, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <p>
              <strong>フォーム名：</strong> {item.title}
            </p>
            <p>
              <strong>説明:</strong> {item.description}
            </p>
          </div>
        ))
      )}
    </main>
  );
}
// ===== END: CreatePage =====