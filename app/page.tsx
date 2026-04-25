// ===== START: トップページUI =====
'use client'
export default function Home() {
  return (
    <main style={{ padding: "20px", fontFamily: "sans-serif" }}>
      \
      {/* タイトル */}
      <h1>ノーコード業務ツール</h1>

      {/* 説明 */}
      <p>フォームを作成してデータ管理を行います</p>

      {/* 区切り */}
      <hr />

      {/* アプリ一覧 */}
      <h2>アプリ一覧</h2>

      {/* 仮ボタン */}
      <button
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer"
        }}
        onClick={() => alert("フォーム作成画面へ（未実装）")}
      >
        フォーム作成
      </button>

    </main>
  );
}

// ===== END: トップページUI =====