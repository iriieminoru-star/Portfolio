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
<<<<<<< HEAD
  // ノーコード用：項目定義
  const [fields, setFields] = useState([
    { label: "名前", type: "text" },
  ]);
=======
  const [list, setList] = useState<Item[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
>>>>>>> 232f0193a481d997ca2905df3165ec20bd13cc2a

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
<<<<<<< HEAD
      if (!title.trim()) {
        alert("フォーム名は必須です");
        return;
      }
      const res = await fetch("http://localhost/no-code-api/backend/save.php", {
=======
      const url = editId
        ? "http://localhost/no-code-api/backend/update.php"
        : "http://localhost/no-code-api/backend/save.php";

      const res = await fetch(url, {
>>>>>>> 232f0193a481d997ca2905df3165ec20bd13cc2a
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

<<<<<<< HEAD
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


=======
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

>>>>>>> 232f0193a481d997ca2905df3165ec20bd13cc2a
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