"use client";

import Link from "next/link";

import { useEffect, useState } from "react";

/**
 * =========================================
 * Top Page
 * =========================================
 *
 * このページでは：
 *
 * - Playwright 自動セットアップ
 * - Chromium 自動インストール
 * - ブラウザ起動テスト
 * - フォーム一覧表示
 * - RPA管理画面
 *
 * を行う
 *
 * =========================================
 */

// =========================================
// 型定義
// =========================================

type Form = {
  id: string;
  title: string;
  description: string;
  created_at: string;
};

// =========================================
// Home Page
// =========================================

export default function HomePage() {

  // =====================================
  // フォーム一覧
  // =====================================

  const [forms, setForms] =
    useState<Form[]>([]);

  // =====================================
  // 通信状態
  // =====================================

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  // =====================================
  // RPA Setup状態
  // =====================================

  const [setupLoading, setSetupLoading] =
    useState(true);

  const [setupFinished, setSetupFinished] =
    useState(false);

  const [setupMessage, setSetupMessage] =
    useState(
      "RPA Engine 初期化中..."
    );

  // =====================================
  // 初回セットアップ
  // =====================================

  useEffect(() => {

    /**
     * =====================================
     * Playwright 自動セットアップ
     * =====================================
     *
     * 1. playwright install
     * 2. chromium install
     * 3. browser launch test
     *
     * を実行
     * =====================================
     */

    const setupPlaywright = async () => {

      try {

        console.log("=================================");
        console.log("PLAYWRIGHT SETUP START");
        console.log("=================================");

        setSetupLoading(true);

        setSetupMessage(
          "Playwright 自動セットアップ中..."
        );

        // =================================
        // Setup API 実行
        // =================================

        const res = await fetch(
          "/api/setup",
          {
            method: "POST",
          }
        );

        // =================================
        // 生レスポンス取得
        // =================================

        const text = await res.text();

        console.log(
          "SETUP RAW RESPONSE =",
          text
        );

        // =================================
        // HTMLエラー判定
        // =================================

        if (
          text.startsWith("<!DOCTYPE") ||
          text.startsWith("<html")
        ) {

          console.error(
            "HTML RESPONSE DETECTED"
          );

          setSetupMessage(
            "❌ /api/setup が見つかりません"
          );

          setSetupFinished(false);

          return;
        }

        // =================================
        // JSON変換
        // =================================

        const data = JSON.parse(text);

        console.log(
          "SETUP RESULT =",
          data
        );

        // =================================
        // 成功判定
        // =================================

        if (data.status === "success") {

          console.log(
            "RPA ENGINE READY"
          );

          setSetupMessage(
            "✅ RPA Engine Ready"
          );

          setSetupFinished(true);

        } else {

          console.error(
            "RPA ENGINE FAILED"
          );

          setSetupMessage(
            "❌ RPA Engine Error"
          );

          setSetupFinished(false);
        }

      } catch (err) {

        console.error(
          "SETUP ERROR =",
          err
        );

        setSetupMessage(
          "❌ Playwright セットアップエラー"
        );

        setSetupFinished(false);

      } finally {

        setSetupLoading(false);
      }
    };

    setupPlaywright();

  }, []);

  // =====================================
  // フォーム一覧取得
  // =====================================

  useEffect(() => {

    const fetchForms = async () => {

      try {

        setError(null);

        
        console.log(
          "FETCH FORMS START"
        );

        const res = await fetch(
          "http://localhost/no-code-api/backend/get_forms.php"
        );

        const data = await res.json();

        console.log(
          "FORMS =",
          data
        );

        if (data.status === "success") {

          setForms(data.forms);

        } else {

          throw new Error(
            data.message ||
            "取得失敗"
          );
        }

      } catch (err: any) {

        console.error(
          "FORMS ERROR =",
          err
        );

        setError(
          err.message ||
          "通信エラー"
        );

      } finally {

        setLoading(false);
      }
    };

    fetchForms();

  }, []);

  // =====================================
  // UI
  // =====================================

  return (

    <main
      style={{
        padding: 40,
        maxWidth: 700,
        margin: "0 auto",
        fontFamily: "sans-serif",
      }}
    >

      {/* =====================================
          Title
      ===================================== */}

      <h1
        style={{
          fontSize: 32,
          // marginBottom: 10,
        }}
      >
        No-Code RPA Platform
      </h1>

      <p
        style={{
          color: "#666",
          marginBottom: 30,
        }}
      >
        フォーム作成・回答収集・
        RPA自動化プラットフォーム
      </p>

      {/* =====================================
          RPA Engine Status
      ===================================== */}

      <div
        style={{
          padding: 20,
          border: "1px solid #ddd",
          borderRadius: 10,
          background: "#f8fafc",
          marginBottom: 30,
        }}
      >

        <h2
          style={{
            fontSize: 20,
            marginBottom: 10,
          }}
        >
          RPA Engine Status
        </h2>

        <p
          style={{
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          {setupMessage}
        </p>

        {/* ローディング */}

        {setupLoading && (

          <p
            style={{
              marginTop: 10,
              color: "#666",
            }}
          >
            初回セットアップ中...
            数分かかる場合があります
          </p>
        )}

        {/* 成功表示 */}

        {!setupLoading && setupFinished && (

          <div
            style={{
              marginTop: 15,
              padding: 15,
              borderRadius: 8,
              background: "#dcfce7",
              color: "#166534",
              lineHeight: 1.8,
              fontWeight: "bold",
            }}
          >

            <div>
              ✅ playwright package installed
            </div>

            <div>
              ✅ chromium browser installed
            </div>

            <div>
              ✅ browser launch success
            </div>

            <div>
              ✅ RPA Engine Ready
            </div>

          </div>
        )}

        {/* エラー表示 */}

        {!setupLoading && !setupFinished && (

          <div
            style={{
              marginTop: 15,
              padding: 15,
              borderRadius: 8,
              background: "#fee2e2",
              color: "#991b1b",
              lineHeight: 1.8,
              fontWeight: "bold",
            }}
          >

            ❌ Playwright setup failed

            <br />

            コンソールログを確認してください

          </div>
        )}

      </div>

      {/* =====================================
          Debug
      ===================================== */}

      <a
        href="http://localhost/no-code-api/backend/debug.php"
        target="_blank"
        style={{
          display: "block",
          marginBottom: 25,
          color: "#ef4444",
          textDecoration: "underline",
        }}
      >
        🔧 debug（開発用）
      </a>

      {/* =====================================
          Main Menu
      ===================================== */}

      {setupFinished && (

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 15,
            marginBottom: 40,
          }}
        >

          {/* フォーム作成 */}

          <Link
            href="/create"
            style={{
              display: "block",
              padding: 16,
              background: "#2563eb",
              color: "#fff",
              textAlign: "center",
              borderRadius: 10,
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            ＋ フォームを作成する
          </Link>

          {/* RPA */}

          <Link
            href="/rpa"
            style={{
              display: "block",
              padding: 16,
              background: "#7c3aed",
              color: "#fff",
              textAlign: "center",
              borderRadius: 10,
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            ▶ RPA管理画面
          </Link>

        </div>
      )}

      {/* =====================================
          状態表示
      ===================================== */}

      {loading && (
        <p>
          フォーム読込中...
        </p>
      )}

      {error && (
        <p
          style={{
            color: "red",
          }}
        >
          {error}
        </p>
      )}

      {/* =====================================
          フォーム一覧
      ===================================== */}

      {!loading && !error && (

        <>

          <h2
            style={{
              marginBottom: 20,
            }}
          >
            フォーム一覧
          </h2>

          {forms.length === 0 && (

            <p
              style={{
                color: "#888",
              }}
            >
              まだフォームがありません
            </p>
          )}

          {forms.map((form) => (

            <div
              key={form.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 10,
                padding: 16,
                marginBottom: 15,
                background: "#fff",
              }}
            >

              {/* タイトル */}

              <h3
                style={{
                  marginBottom: 8,
                }}
              >
                {form.title}
              </h3>

              {/* 説明 */}

              <p
                style={{
                  color: "#666",
                  marginBottom: 15,
                }}
              >
                {form.description}
              </p>

              {/* Links */}

              <div
                style={{
                  marginBottom: 10,
                  display: "flex",
                  gap: 16,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                {/* 回答 */}
                <Link
                  href={`/form/${form.id}`}
                  style={{
                    color: "#16a34a",
                    fontWeight: "bold",
                  }}
                >
                  回答する
                </Link>

                {/* 回答一覧 */}
                <Link
                  href={`/answers/${form.id}`}
                  style={{
                    color: "#2563eb",
                    fontWeight: "bold",
                  }}
                >
                  回答一覧
                </Link>

                {/* CSV */}
                <a
                  href={`http://localhost/no-code-api/backend/export_csv.php?form_id=${form.id}`}
                  style={{
                    color: "#f59e0b",
                    fontWeight: "bold",
                  }}
                >
                  CSV
                </a>

                {/* 削除 */}
                <button
                  onClick={async () => {
                    const ok = confirm("削除しますか？");
                    if (!ok) return;

                    const res = await fetch(`/api/forms/${form.id}`, {
                      method: "DELETE",
                    });

                    const text = await res.text();
                    console.log(text);
                  }}
                  style={{
                    color: "red",
                    fontWeight: "bold",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  削除
                </button>
              </div>

              {/* 作成日 */}

              <p
                style={{
                  fontSize: 12,
                  color: "#999",
                }}
              >
                作成日：
                {" "}
                {form.created_at}
              </p>

            </div>
          ))}
        </>
      )}

    </main>
  );
}