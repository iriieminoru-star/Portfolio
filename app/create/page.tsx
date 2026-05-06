"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";


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

type FieldType = "text" | "number";

type Field = {
  id: string;
  label: string;
  type: FieldType;
  value: string;
}

const API_BASE = "http://localhost/no-code-api/backend";

// ===== START =====
export default function CreatePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [list, setList] = useState<Item[]>([]);
  const [editId, setEditId] = useState<string | null>(null);

  const [fields, setFields] = useState<Field[]>([
    { id: crypto.randomUUID(), label: "", type: "text", value: "" },
  ]);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // ========================
  // 一覧取得
  // ========================
  useEffect(() => {
    fetch(`${API_BASE}/list.php`)
      .then((res) => res.json())
      .then((data: Item[]) => {
        setList(data);
      })
      .catch((err) => {
        console.error(err);
        setError("一覧取得に失敗しました");
      });
  }, []);

  // ========================
  // 保存 / 更新
  // ========================
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!title.trim()) {
        setError("フォーム名は必須です")
        return;
      }

      const res = await fetch(`${API_BASE}/save.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editId,
          title,
          description,
          fields,
        }),
      });

      if (!res.ok) {
        throw new Error("保存に失敗しました");
      }

      const data: SaveResponse = await res.json();

      if (data.status === "error") {
        throw new Error(data.message);
      }

      // 再取得
      const listRes = await fetch(`${API_BASE}/list.php`);
      const newList: Item[] = await listRes.json();
      setList(newList);

      // 初期化
      setTitle("");
      setDescription("");
      setEditId(null);
      setFields([
        { id: crypto.randomUUID(), label: "", type: "text", value: "" },
      ]);

    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("通信エラー");
      }
    } finally {
      setLoading(false);
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
    try {
      const res = await fetch(`${API_BASE}/delete.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        throw new Error("削除に失敗しました");
      }

      setList((prev) => prev.filter((item) => item.id !== id));

    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("削除エラー");
      }
    }
  };

  // ========================
  // 項目操作
  // ========================
  const addField = () => {
    setFields((prev) => [
      ...prev,
      { id: crypto.randomUUID(), label: "", type: "text", value: "" },
    ]);
  };

  const updateField = (
    id: string,
    key: keyof Field,
    value: string
  ) => {
    setFields((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, [key]: value } : f
      )
    );
  };

  const removeField = (id: string) => {
    if (!confirm("この項目を削除しますか？")) return;

    setFields((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((f) => f.id !== id);
    });
  };

  const handleChange = (id: string, value: string) => {
    setFields((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, value } : f
      )
    );
  };

  // ====================
  // 並び替え（上）
  // ========================
  const moveUp = (index: number) => {
    if (index === 0) return;
    setFields((prev) => {
      const newFields = [...prev];
      [newFields[index - 1], newFields[index]] =
        [newFields[index], newFields[index - 1]];
      return newFields;
    });
  };

  // ====================
  // 並び替え(下)
  // ====================
  const moveDown = (index: number) => {
    if (index === fields.length - 1) return;
    setFields((prev) => {
      const newFields = [...prev];
      [newFields[index + 1], newFields[index]] =
        [newFields[index], newFields[index + 1]];
      return newFields;
    });
  };

  // ====================
  // 表示
  // ====================
  return (
    <main style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <div style={{ marginBottom: "20px" }}>
        <Link href="/create">新規作成</Link>
        <Link href="/list">一覧</Link>
      </div>

      <h1>フォーム作成</h1>

      {/* エラー表示 */}
      {error && <p style={{ color: "red" }}> {error} </p>}

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="フォーム名"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="説明"
      />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "保存中..." : editId ? "更新" : "保存"}
      </button>

      <hr />

      <h2>項目設定</h2>

      {fields.map((field, index) => (
        <div key={field.id}>
          <input
            value={field.label}
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

          <button onClick={() => moveUp(index)}>↑</button>
          <button onClick={() => moveDown(index)}>↓</button>
          <button onClick={() => removeField(field.id)}>削除</button>
        </div>
      ))}

      <button onClick={addField}>＋追加</button>

      <hr />

      <h2>一覧</h2>

      {list.map((item) => (
        <div key={item.id}>
          <p>{item.title}</p>
          <button onClick={() => handleEdit(item)}>編集</button>
          <button onClick={() => handleDelete(item.id)}>削除</button>
          <button onClick={() => router.push(`/form/${item.id}`)}>
            入力
          </button>
        </div>
      ))}
    </main>
  );
}