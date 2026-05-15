// ==============================
// Next.js ルートレイアウト
// ==============================
// このファイルは全ページ共通のレイアウト
// ・フォント設定
// ・共通ヘッダー
// ・全体レイアウト構造
// を定義する

import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// ==============================
// フォント設定（Geist Sans）
// ==============================
// 全体のUIフォント（サンセリフ）
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// ==============================
// フォント設定（Geist Mono）
// ==============================
// コード表示などに使う等幅フォント
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ==============================
// メタデータ（SEO用）
// ==============================
// タイトル・説明はブラウザタブや検索に影響する
export const metadata: Metadata = {
  title: "No-Code Survey App",
  description: "フォーム作成・回答収集アプリ",
};

// ==============================
// RootLayoutコンポーネント
// ==============================
// 全ページ共通のUI構造をここで定義する
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // ==============================
    // HTMLルート
    // ==============================
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* ==============================
          body全体レイアウト
      ============================== */}
      <body className="min-h-full flex flex-col bg-gray-50">

        {/* ==============================
            ヘッダー（全ページ共通ナビ）
        ============================== */}
        <header
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid #e5e7eb",
            background: "#fff",
          }}
        >
          {/* ナビゲーションリンク */}
          <nav
            style={{
              display: "flex",
              gap: "16px",
              alignItems: "center",
              fontSize: "14px",
            }}
          >
            {/* ホーム（フォーム一覧） */}
            <Link
              href="/"
              style={{
                fontWeight: "bold",
                color: "#2563eb",
              }}
            >
              🏠 フォーム一覧
            </Link>

            {/* フォーム作成ページ */}
            <Link
              href="/create"
              style={{
                color: "#555",
              }}
            >
              ＋ 作成
            </Link>
          </nav>
        </header>

        {/* ==============================
            メインコンテンツ領域
        ============================== */}
        {/* 各ページの中身がここに差し込まれる */}
        <main className="flex-1">
          {children}
        </main>

      </body>
    </html>
  );
}