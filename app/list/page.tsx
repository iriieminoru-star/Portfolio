"use client";

import { useState, useEffect } from "react";

// 一覧データ１件分の型
type FormItem = {
    id: number;
    title: string;
    description: string;
};

// 削除APIのレスポンス型
type DeleteResponse =
    | { status: "success" }
    | { status: "error"; message: string };

type UpdateResponse =
    | { status: "success" }
    | { status: "error"; message: string };

export default function ListPage() {
    // 一覧データを管理するstate
    const [data, setData] = useState<FormItem[]>([]);
    // データ取得中かどうかを管理するstate
    // 初回表示時にAPIからデータを取るため、その間は「読み込み中」を表示する
    const [loading, setLoading] = useState<boolean>(true);
    // 編集中のIDとフォームのstate
    const [editId, setEditId] = useState<number | null>(null);
    // 編集用：フォーム名
    const [title, setTitle] = useState("");
    // 編集用：説明
    const [description, setDescription] = useState("");
    // エラーメッセージ
    const [error, setError] = useState<string | null>(null);
    // 成功メッセージ
    const [success, setSuccess] = useState<string | null>(null);

    // ★成功メッセージを3秒後に自動で消す
    useEffect(() => {
        if (!success) return;

        const timer = setTimeout(() => {
            setSuccess(null);
        }, 3000);

        return () => clearTimeout(timer);
    }, [success]);


    // 初回表示時に一覧データを取得する処理
    // 第二引数 [] により「最初の1回だけ」実行される
    useEffect(() => {
        fetch("http://localhost/no-code-api/backend/list.php")
            .then((res) => res.json())
            .then((json: FormItem[]) => {
                setData(json);          // データをstateにセット
                setLoading(false);      // ローディング終了
            })
            .catch((err) => {
                console.error("取得エラー：", err);
                setLoading(false);
            });
    }, []);

    // 削除処理（指定のIDデータを削除する）
    const handleDelete = async (id: number) => {
        console.log("DELETE ID:", id);
        // 確認ダイアログ
        if (!confirm("本当に削除しますか？")) return;

        try {
            // APIに削除リクエストを送る
            const res = await fetch("http://localhost/no-code-api/backend/delete.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id })
            });

            const data: DeleteResponse = await res.json();

            if (data.status === "success") {
                // 画面から削除（再度APIを呼ばず、stateを直接更新することで高速化）
                // filterで指定ID以外を残すことで削除を実現
                setData((prev) => prev.filter((item) => item.id !== id));
                // alert("削除しました");
                setSuccess("削除しました");
                setError(null);

            } else {
                // alert(data.message);
                setError(data.message);
                setSuccess(null);
            }
        } catch (err) {
            console.error("通信エラー：", err);
            setError("通信エラーが発生しました");
            setSuccess(null);
        }
    };

    const handleUpdate = async (id: number) => {
        try {
            if (!title.trim()) {
                // alert("フォーム名は必須です");
                setError("フォーム名は必須です");
                setSuccess(null);
                return;
            }
            const res = await fetch("http://localhost/no-code-api/backend/update.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id,
                    title,
                    description
                }),
            });

            const data: UpdateResponse = await res.json();

            if (data.status === "success") {
                // 更新成功したら、stateも更新して画面に反映させる
                setData((prev) =>
                    prev.map((item) =>
                        item.id === id
                            ? { ...item, title, description }
                            : item
                    )
                );
                setEditId(null); // 編集モード終了

                // alert("更新しました");
                setSuccess("更新しました");
                setError(null);

            } else {
                setError(data.message);
                setSuccess(null);
            }
        } catch (err) {
            console.error(err);
            setError("通信エラーが発生しました");
            setSuccess(null);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>一覧画面</h1>
            {/* エラー表示 */}
            {error && (
                <div style={{
                    backgroundColor: "#ffdddd",
                    color: "#900",
                    padding: "10px",
                    marginBottom: "10px",
                    borderRadius: "5px",
                }}>
                    {error}
                </div>
            )}
            {/* 成功メッセージ */}
            {success && (
                <div style={{
                    backgroundColor: "#ddffdd",
                    color: "#060",
                    padding: "10px",
                    marginBottom: "10px",
                    borderRadius: "5px",
                }}>
                    {success}
                </div>
            )}

            {/*
         CSVダウンロードボタン
         PHPのexport.phpを直接呼び出し、CSVファイルをダウンロードする
        */}
            <button
                onClick={() => {
                    window.location.href = "http://localhost/no-code-api/backend/export.php";
                }}
                style={{
                    padding: "10px 20px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                }}
            >
                CSVダウンロード
            </button>

            {/* ローディング中 */}
            {loading && <p>読み込み中...</p>}

            {/* データなし */}
            {!loading && data.length === 0 && <p>データがありません。</p>}

            {/* データあり */}
            {!loading && data.length > 0 && (
                <table border={1}
                    cellPadding={10}
                    style={{
                        borderCollapse: "collapse",
                        width: "100%",
                        tableLayout: "fixed",
                    }}
                >
                    <thead>
                        <tr>
                            <th style={{ width: "30%" }}>フォーム名</th>
                            <th style={{ width: "40%" }}>説明</th>
                            <th style={{ width: "15%" }}>削除</th>
                            <th style={{ width: "15%" }}>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item.id}>
                                <td>
                                    {editId === item.id ? (
                                        <input
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            style={{ width: "90%" }}
                                        />
                                    ) : (
                                        item.title
                                    )}
                                </td>
                                <td>
                                    {editId === item.id ? (
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            style={{
                                                width: "95%",
                                                minHeight: "60px",
                                                padding: "5px",
                                            }}
                                        />
                                    ) : (
                                        item.description
                                    )}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                    {/* 削除ボタン */}
                                    <button onClick={() => handleDelete(item.id)}>
                                        削除
                                    </button>
                                </td>
                                <td style={{ textAlign: "center" }}>
                                    {/* 編集ボタン */}
                                    {editId === item.id ? (
                                        <>
                                            <button onClick={() => handleUpdate(item.id)}>
                                                保存
                                            </button>
                                            <button onClick={() => setEditId(null)}>
                                                キャンセル
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setEditId(item.id);
                                                setTitle(item.title);
                                                setDescription(item.description);
                                                // 編集モードに入るとき、フォームに現在の値をセットする
                                                setError(null);
                                                setSuccess(null);
                                            }}>
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
