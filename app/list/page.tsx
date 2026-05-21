"use client";

import { useState, useEffect } from "react";

type FormItem = {
  id: number;
  title: string;
  description: string;
};

type DeleteResponse =
  | { status: "success" }
  | { status: "error"; message: string };

type UpdateResponse =
  | { status: "success" }
  | { status: "error"; message: string };

export default function ListPage() {
  const [data, setData] = useState<FormItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // =========================
  // success auto hide
  // =========================
  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => {
      setSuccess(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [success]);

  // =========================
  // fetch list
  // =========================
  useEffect(() => {
    fetch("http://localhost/no-code-api/backend/list.php")
      .then((res) => res.json())
      .then((json: FormItem[]) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // =========================
  // delete
  // =========================
  const handleDelete = async (id: number) => {
    if (!confirm("本当に削除しますか？")) return;

    try {
      const res = await fetch(
        "http://localhost/no-code-api/backend/delete.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        }
      );

      const data: DeleteResponse = await res.json();

      if (data.status === "success") {
        setData((prev) =>
          prev.filter((item) => item.id !== id)
        );

        setSuccess("削除しました");
        setError(null);
      } else {
        setError(data.message);
        setSuccess(null);
      }
    } catch {
      setError("通信エラーが発生しました");
      setSuccess(null);
    }
  };

  // =========================
  // update
  // =========================
  const handleUpdate = async (id: number) => {
    try {
      if (!title.trim()) {
        setError("フォーム名は必須です");
        return;
      }

      const res = await fetch(
        "http://localhost/no-code-api/backend/update.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            title,
            description,
          }),
        }
      );

      const data: UpdateResponse = await res.json();

      if (data.status === "success") {
        setData((prev) =>
          prev.map((item) =>
            item.id === id
              ? { ...item, title, description }
              : item
          )
        );

        setEditId(null);
        setSuccess("更新しました");
        setError(null);
      } else {
        setError(data.message);
        setSuccess(null);
      }
    } catch {
      setError("通信エラーが発生しました");
      setSuccess(null);
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div
      data-rpa-id="page-list-root"
      style={{ padding: "20px" }}
    >
      <h1 data-rpa-id="page-list-title">
        一覧画面
      </h1>

      {/* ERROR */}
      {error && (
        <div
          data-rpa-id="page-list-error"
          style={{
            backgroundColor: "#ffdddd",
            color: "#900",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "5px",
          }}
        >
          {error}
        </div>
      )}

      {/* SUCCESS */}
      {success && (
        <div
          data-rpa-id="page-list-success"
          style={{
            backgroundColor: "#ddffdd",
            color: "#060",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "5px",
          }}
        >
          {success}
        </div>
      )}

      {/* CSV */}
      <button
        data-rpa-id="page-list-csv-download"
        onClick={() => {
          window.location.href =
            "http://localhost/no-code-api/backend/export.php";
        }}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        CSVダウンロード
      </button>

      {/* LOADING */}
      {loading && (
        <p data-rpa-id="page-list-loading">
          読み込み中...
        </p>
      )}

      {/* EMPTY */}
      {!loading && data.length === 0 && (
        <p data-rpa-id="page-list-empty">
          データがありません。
        </p>
      )}

      {/* TABLE */}
      {!loading && data.length > 0 && (
        <table
          data-rpa-id="page-list-table"
          border={1}
          cellPadding={10}
          style={{
            borderCollapse: "collapse",
            width: "100%",
            tableLayout: "fixed",
          }}
        >
          <thead data-rpa-id="page-list-table-head">
            <tr>
              <th>フォーム名</th>
              <th>説明</th>
              <th>削除</th>
              <th>操作</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr
                key={item.id}
                data-rpa-id={`page-list-row-${item.id}`}
              >
                {/* TITLE */}
                <td>
                  {editId === item.id ? (
                    <input
                      data-rpa-id={`page-list-row-${item.id}-title-input`}
                      value={title}
                      onChange={(e) =>
                        setTitle(e.target.value)
                      }
                      style={{ width: "90%" }}
                    />
                  ) : (
                    <span
                      data-rpa-id={`page-list-row-${item.id}-title`}
                    >
                      {item.title}
                    </span>
                  )}
                </td>

                {/* DESCRIPTION */}
                <td>
                  {editId === item.id ? (
                    <textarea
                      data-rpa-id={`page-list-row-${item.id}-desc-input`}
                      value={description}
                      onChange={(e) =>
                        setDescription(e.target.value)
                      }
                      style={{
                        width: "95%",
                        minHeight: "60px",
                        padding: "5px",
                      }}
                    />
                  ) : (
                    <span
                      data-rpa-id={`page-list-row-${item.id}-desc`}
                    >
                      {item.description}
                    </span>
                  )}
                </td>

                {/* DELETE */}
                <td style={{ textAlign: "center" }}>
                  <button
                    data-rpa-id={`page-list-row-${item.id}-delete`}
                    onClick={() => handleDelete(item.id)}
                  >
                    削除
                  </button>
                </td>

                {/* ACTION */}
                <td style={{ textAlign: "center" }}>
                  {editId === item.id ? (
                    <>
                      <button
                        data-rpa-id={`page-list-row-${item.id}-save`}
                        onClick={() =>
                          handleUpdate(item.id)
                        }
                      >
                        保存
                      </button>

                      <button
                        data-rpa-id={`page-list-row-${item.id}-cancel`}
                        onClick={() => setEditId(null)}
                      >
                        キャンセル
                      </button>
                    </>
                  ) : (
                    <button
                      data-rpa-id={`page-list-row-${item.id}-edit`}
                      onClick={() => {
                        setEditId(item.id);
                        setTitle(item.title);
                        setDescription(item.description);
                        setError(null);
                        setSuccess(null);
                      }}
                    >
                      編集
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}