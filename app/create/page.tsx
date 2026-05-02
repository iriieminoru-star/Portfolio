"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// ===== 型定義 =====
type Item = {
  id: string;
  title: string;
  description: string;
};

type SaveResponse =
  | {
    status: "success";
    title: string;
    description: string;
  }
  | {
    status: "error";
    message: string;
  };

type Field = {
  id: string;
  label: string;
  type: string;
};

// ===== START =====
export default function CreatePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [list, setList] = useState<Item[]>([]);
  const [editId, setEditId] = useState<string | null>(null);

  // ========================
  // ノーコード用：項目定義
  // ========================
  const [fields, setFields] = useState<Field[]>([
    { id: crypto.randomUUID(), label: "", type: "text" },
  ]);

  // ========================
  // 実際の入力値
  // ========================
  const [formData, setFormData] = useState<{ [key: string]: string }>({});

  // ========================
  // 一覧取得
  // ========================
  useEffect(() => {
    fetch("http://localhost/no-code-api/backend/list.php")
      .then((res) => res.json())
      .then((data: Item[]) => {
        setList(data);
      })
      .catch(console.error);
  }, []);

  // ========================
  // 保存 / 更新
  // ========================
  const handleSubmit = async () => {
    try {
      if (!title.trim()) {
        alert("フォーム名は必須です");
        return;
      }

      const res = await fetch(
        "http://localhost/no-code-api/backend/save.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: editId,
            title,
            description,
            fields,
            formData,
          }),
        }
      );

      const data: SaveResponse = await res.json();

      if (data.status === "success") {
        alert(editId ? "更新成功" : "保存成功");

        const listRes = await fetch(
          "http://localhost/no-code-api/backend/list.php"
        );
        const newList: Item[] = await listRes.json();
        setList(newList);

        setTitle("");
        setDescription("");
        setEditId(null);
        setFormData({});
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("通信エラー");
    }
  };

  // ========================
  // 編集
  // ========================
  const handleEdit = (item: Item) => {
    setTitle(item.title);
    setDescription(item.description);
    setEditId(item.id);
  };

  // ========================
  // 削除
  // ========================
  const handleDelete = async (id: string) => {
    await fetch(
      "http://localhost/no-code-api/backend/delete.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      }
    );

    setList(list.filter((item) => item.id !== id));
  };

  // ========================
  // 項目追加
  // ========================
  const addField = () => {
    setFields([
      ...fields,
      { id: crypto.randomUUID(), label: "", type: "text" },
    ]);
  };

  // ========================
  // 項目更新
  // ========================
  const updateField = (id: string, key: string, value: string) => {
    setFields((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, [key]: value } : f
      )
    );
  };

  // ========================
  // 入力フォームの 値 更新
  // ========================
  const handleChange = (id: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <main style={{ padding: "20px", fontFamily: "sans-serif" }}>
      {/* ナビ */}
      <div style={{ marginBottom: "20px" }}>
        <Link href="/create" style={{ marginRight: "10px" }}>
          新規作成
        </Link>
        <Link href="/list">
          一覧
        </Link>
      </div>

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
        {editId ? "更新" : "保存"}
      </button>

      <hr />

      <h2>項目設定（ノーコード）</h2>

      {fields.map((field) => (
        <div key={field.id} style={{ marginBottom: "10px" }}>
          <input
            value={field.label || ""}
            placeholder="項目名（例：名前）"
            onChange={(e) =>
              updateField(field.id, "label", e.target.value)
            }
          />

          <select
            value={field.type}
            onChange={(e) =>
              updateField(field.id, "type", e.target.value)
            }
          >
            <option value="text">テキスト</option>
            <option value="number">数値</option>
          </select>
        </div>
      ))}

      <button onClick={addField}>＋項目追加</button>

      <hr />

      <h2>入力フォーム（実際の入力）</h2>

      {fields.map((field) => (
        <div key={field.id} style={{ marginBottom: "10px" }}>

          {/* ラベル表示 */}
          <label>
            {field.label ? field.label : "項目名を入力してください"}
          </label>
          {/* テキスト */}
          {field.type === "text" && (
            <input
              value={formData[field.id] || ""}
              onChange={(e) =>
                handleChange(field.id, e.target.value)
              }
              style={{ display: "block" }}
            />
          )}
          {/* ナンバー */}
          {field.type === "number" && (
            <input
              type="number"
              value={formData[field.id] || ""}
              onChange={(e) =>
                handleChange(field.id, e.target.value)
              }
              style={{ display: "block" }}
            />
          )}
        </div>
      ))}

      <h2>一覧</h2>

      {list.length === 0 ? (
        <p>データがありません</p>
      ) : (
        list.map((item) => (
          <div key={item.id} style={{ border: "1px solid #ccc", padding: 10 }}>
            <p><strong>{item.title}</strong></p>
            <p>{item.description}</p>

            <button onClick={() => handleEdit(item)}>編集</button>
            <button onClick={() => handleDelete(item.id)}>削除</button>
          </div>
        ))
      )}
    </main>
  );
}