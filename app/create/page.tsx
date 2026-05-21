"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
};

const API_BASE = "http://localhost/no-code-api/backend";

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
    fetch(`${API_BASE}/forms.php`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "error") {
          throw new Error(data.message);
        }
        setList(data.forms);
      })
      .catch((err) => {
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
        setError("フォーム名は必須です");
        return;
      }

      const payload = {
        id: editId,
        title,
        description,
        fields,
      };

      const res = await fetch(`${API_BASE}/save.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      const data: SaveResponse = JSON.parse(text);

      if (!res.ok) throw new Error(`HTTP ERROR: ${res.status}`);
      if (data.status === "error") throw new Error(data.message);

      const listRes = await fetch(`${API_BASE}/forms.php`);
      const listData = await listRes.json();

      setList(listData.forms);

      setTitle("");
      setDescription("");
      setEditId(null);
      setFields([
        { id: crypto.randomUUID(), label: "", type: "text", value: "" },
      ]);
    } catch (err: any) {
      setError(err.message || "通信エラー");
    } finally {
      setLoading(false);
    }
  };

  // ========================
  // 編集
  // ========================
  const handleEdit = async (item: Item) => {
    try {
      setError(null);

      const res = await fetch(
        `${API_BASE}/detail.php?id=${item.id}`
      );

      const data = await res.json();

      if (data.status === "error") {
        throw new Error(data.message);
      }

      setTitle(data.title);
      setDescription(data.description);
      setFields(data.fields || []);
      setEditId(data.id);
    } catch (err: any) {
      setError(err.message || "編集データ取得エラー");
    }
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

      if (!res.ok) throw new Error("削除に失敗しました");

      setList((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      setError(err.message || "削除エラー");
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

  const updateField = (id: string, key: keyof Field, value: string) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [key]: value } : f))
    );
  };

  const removeField = (id: string) => {
    if (!confirm("この項目を削除しますか？")) return;

    setFields((prev) =>
      prev.length === 1 ? prev : prev.filter((f) => f.id !== id)
    );
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setFields((prev) => {
      const newFields = [...prev];
      [newFields[index - 1], newFields[index]] =
        [newFields[index], newFields[index - 1]];
      return newFields;
    });
  };

  const moveDown = (index: number) => {
    if (index === fields.length - 1) return;
    setFields((prev) => {
      const newFields = [...prev];
      [newFields[index + 1], newFields[index]] =
        [newFields[index], newFields[index + 1]];
      return newFields;
    });
  };

  // ========================
  // UI
  // ========================
  return (
    <main
      data-rpa-id="page-create-root"
      style={{ padding: 20, fontFamily: "sans-serif" }}
    >
      <div data-rpa-id="page-create-nav">
        <Link href="/create" data-rpa-id="page-create-nav-create">
          新規作成
        </Link>

        <Link href="/forms" data-rpa-id="page-create-nav-list">
          一覧
        </Link>
      </div>

      <h1 data-rpa-id="page-create-title">フォーム作成</h1>

      {error && (
        <p data-rpa-id="page-create-error" style={{ color: "red" }}>
          {error}
        </p>
      )}

      <input
        data-rpa-id="page-create-title-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="フォーム名"
      />

      <textarea
        data-rpa-id="page-create-description-input"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="説明"
      />

      <button
        data-rpa-id="page-create-submit-button"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "保存中..." : editId ? "更新" : "保存"}
      </button>

      <hr />

      <h2 data-rpa-id="page-create-fields-title">項目設定</h2>

      {fields.map((field, index) => (
        <div
          key={field.id}
          data-rpa-id={`page-create-field-${field.id}`}
        >
          <input
            data-rpa-id={`page-create-field-${field.id}-label`}
            value={field.label}
            onChange={(e) =>
              updateField(field.id, "label", e.target.value)
            }
          />

          <select
            data-rpa-id={`page-create-field-${field.id}-type`}
            value={field.type}
            onChange={(e) =>
              updateField(field.id, "type", e.target.value)
            }
          >
            <option value="text">テキスト</option>
            <option value="number">数値</option>
          </select>

          <button
            data-rpa-id={`page-create-field-${field.id}-up`}
            onClick={() => moveUp(index)}
          >
            ↑
          </button>

          <button
            data-rpa-id={`page-create-field-${field.id}-down`}
            onClick={() => moveDown(index)}
          >
            ↓
          </button>

          <button
            data-rpa-id={`page-create-field-${field.id}-delete`}
            onClick={() => removeField(field.id)}
          >
            削除
          </button>
        </div>
      ))}

      <button
        data-rpa-id="page-create-field-add"
        onClick={addField}
      >
        ＋追加
      </button>

      <hr />

      <h2 data-rpa-id="page-create-list-title">一覧</h2>

      {list.map((item) => (
        <div
          key={item.id}
          data-rpa-id={`page-create-item-${item.id}`}
        >
          <p data-rpa-id={`page-create-item-${item.id}-title`}>
            {item.title}
          </p>

          <button
            data-rpa-id={`page-create-item-${item.id}-edit`}
            onClick={() => handleEdit(item)}
          >
            編集
          </button>

          <button
            data-rpa-id={`page-create-item-${item.id}-answer`}
            onClick={() => router.push(`/answer/${item.id}`)}
          >
            回答
          </button>

          <button
            data-rpa-id={`page-create-item-${item.id}-delete`}
            onClick={() => handleDelete(item.id)}
          >
            削除
          </button>
        </div>
      ))}
    </main>
  );
}