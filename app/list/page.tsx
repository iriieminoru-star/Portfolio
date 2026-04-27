"use client";

import { useState, useEffect } from "react";

type FormItem = {
    id: number;
    title: string;
    description: string;
};


export default function ListPage() {
    type DeleteResponse =
    | { status: "success" }
    | { status: "error"; message: string };
    
    const [data, setData] = useState<FormItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [editId, setEditId] = useState<number | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

useEffect(() => {
    fetch("http://localhost/no-code-api/backend/list.php")
    .then((res) => res.json())
    .then((json: FormItem[]) => {
            setData(json);
            setLoading(false);
        })
        .catch((err) => {
            console.error("取得エラー：", err);
            setLoading(false);
        });
    }, []);
    
    const handleDelete = async (id: number) => {
        console.log("DELETE ID:", id);
        if (!confirm("本当に削除しますか？")) return;
        
        try {
            const res = await fetch("http://localhost/no-code-api/backend/delete.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id })
            });
            
            const data: DeleteResponse = await res.json();
            
            if (data.status === "success") {
                // 画面から削除
                setData((prev) => prev.filter((item) => item.id !== id));
                alert("削除しました");
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error(err);
            console.error("通信エラー：", err);
        }
    };
    
    
    return (
        <div style={{ padding: "20px" }}>
        <h1>一覧画面</h1>

        <button
            onClick={() => {
                window.location.href = "http://localhost/no-code-api/backend/export.php";
            }}
            style={{ marginBottom: "20px" }}
        >
            CSVダウンロード  
        </button>
        
        {loading && <p>読み込み中...</p>}

        {!loading && data.length === 0 && <p>データがありません。</p>}

        {!loading && data.length > 0 && (
            <table border={1} cellPadding={10}>
                <thead>
                    <tr>
                        <th>フォーム名</th>
                        <th>説明</th>
                        <th>削除</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id}>
                            <td>{item.title}</td>
                            <td>{item.description}</td>
                            <td>
                                <button onClick={() => handleDelete(item.id)}>削除</button>
                                <button onClick={() => {
                                    setEditId(item.id);
                                    setTitle(item.title);
                                    setDescription(item.description);
                                }}>
                                編集
                            </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
    </div>
    );
}
