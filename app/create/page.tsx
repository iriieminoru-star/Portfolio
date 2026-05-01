"use client";

import { useEffect, useState } from "react";

// ===== 型定義 =====
type SaveResponse =
  | {
  status: "success";
  title: string;
  description: string;
  message?: string;
  }
  | {
  status: "error";
  message: string;
  };
// ================= 

// ===== START: CreatePage =====
export default function CreatePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // ノーコード用：項目定義
  const [fields, setFields] = useState([
    { label: "名前", type: "text" },
  ]);

  const handleSubmit = async () => {
    try {
      if (!title.trim()) {
        alert("フォーム名は必須です");
        return;
      }
      const res = await fetch("http://localhost/no-code-api/backend/save.php", {
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

        // 入力クリア
        setTitle("");
        setDescription("");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("通信エラー");
    }
  };

  // 項目を追加する関数
  const addField = () => {
    setFields([
      ...fields,
      { label: "", type: "text" },
    ]);
  };

  // 公網を更新する関数
  const updateField = (
    index: number,
    key: string,
    value: string
  ) => {
    const newFields = [...fields];
    newFields[index] = {
      ...newFields[index],
      [key]: value,
    };
    setFields(newFields);
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
      <h2 style={{ marginBottom: "20px" }}>
        項目設定（ノーコード）
      </h2>

      {fields.map((field, index) => (
        // <div key={index} style={{ marginBottom: "10px" }}>
        <div
          key={index}
        style={{
          marginBottom: "10px",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
        }}
        >
          <input
            type="text"
            placeholder="項目"
            value={field.label}
            onChange={(e) =>
              updateField(index, "label", e.target.value)
            }
            style={{
              marginRight: "10px",
              padding: "5px",
            }}
          />

          <select
            value={field.type}
            onChange={(e) =>
              updateField(index, "type", e.target.value)
            }
            style={{
              padding: "5px",
            }}
          >
            <option value="text">テキスト</option>
            <option value="number">数値</option>
          </select>
        </div>
      ))}

      <button onClick={addField}>＋項目追加</button>

    </main>
  );
}
// ===== END: CreatePage =====