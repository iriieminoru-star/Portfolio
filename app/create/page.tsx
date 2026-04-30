"use client";

import { useEffect, useState } from "react";

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

// ===== START =====
export default function CreatePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [list, setList] = useState<Item[]>([]);
  const [editId, setEditId] = useState<string | null>(null);

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
      const url = editId
        ? "http://localhost/no-code-api/backend/update.php"
        : "http://localhost/no-code-api/backend/save.php";

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editId,
          title,
          description,
        }),
      });

      const data: SaveResponse = await res.json();

      if (data.status === "success") {
        alert(editId ? "更新成功" : "保存成功");

        // 再取得
        const listRes = await fetch(
          "http://localhost/no-code-api/backend/list.php"
        );
        const newList: Item[] = await listRes.json();
        setList(newList);

        // 初期化
        setTitle("");
        setDescription("");
        setEditId(null);
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
    setEditId(item.id);
    setTitle(item.title);
    setDescription(item.description);
  };

  // ========================
  // 削除
  // ========================
  const handleDelete = async (id: string) => {
    if (!confirm("削除しますか？")) return;

    await fetch("http://localhost/no-code-api/backend/delete.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    setList((prev) => prev.filter((item) => item.id !== id));
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
        {editId ? "更新" : "保存"}
      </button>

      <hr />

      <h2>一覧</h2>

      {list.length === 0 ? (
        <p>データがありません</p>
      ) : (
        list.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
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