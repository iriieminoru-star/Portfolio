"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  isRecorderRunning,
  startRecorder,
  stopRecorder,
} from "./rpa/recorder";

type Form = {
  id: string;
  title: string;
  description: string;
  created_at: string;
};

export default function HomePage() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] =
    useState<string | null>(null);

  const [setupLoading, setSetupLoading] =
    useState(true);

  const [setupFinished, setSetupFinished] =
    useState(false);

  const [setupMessage, setSetupMessage] =
    useState("RPA Engine 初期化中...");

  const [recording, setRecording] =
    useState(false);

  useEffect(() => {
    console.log("[RPA] home loaded");
  }, []);

  useEffect(() => {
    const running = isRecorderRunning();
    setRecording(running);

    console.log("[RPA] restore recording:", running);
  }, []);

  useEffect(() => {
    const setupPlaywright = async () => {
      try {
        console.log("PLAYWRIGHT SETUP START");

        setSetupLoading(true);

        const res = await fetch("/api/setup", {
          method: "POST",
        });

        const text = await res.text();

        if (
          text.startsWith("<!DOCTYPE") ||
          text.startsWith("<html")
        ) {
          setSetupMessage("❌ /api/setup が見つかりません");
          setSetupFinished(false);
          return;
        }

        const data = JSON.parse(text);

        if (data.status === "success") {
          setSetupMessage("✅ RPA Engine Ready");
          setSetupFinished(true);
        } else {
          setSetupMessage("❌ RPA Engine Error");
          setSetupFinished(false);
        }
      } catch (err) {
        console.error("SETUP ERROR", err);
        setSetupMessage("❌ Playwright セットアップエラー");
        setSetupFinished(false);
      } finally {
        setSetupLoading(false);
      }
    };

    setupPlaywright();
  }, []);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        setError(null);

        console.log("[RPA] forms fetch start");

        const res = await fetch(
          "http://localhost/no-code-api/backend/get_forms.php"
        );

        const data = await res.json();

        if (data.status === "success") {
          setForms(data.forms);
        } else {
          throw new Error(data.message || "取得失敗");
        }
      } catch (err: any) {
        setError(err.message || "通信エラー");
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  const handleRpaToggle = async () => {
    if (recording) {
      const result = stopRecorder();
      console.log("RECORDED:", result);

      await fetch("/api/scenario/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "recorded_scenario",
          steps: result,
        }),
      });

      localStorage.removeItem("rpa_recording");
      setRecording(false);

      console.log("[RPA] stopped");
    } else {
      startRecorder();
      localStorage.setItem("rpa_recording", "true");
      setRecording(true);

      console.log("[RPA] started");
    }
  };

  return (
    <main
      data-rpa-id="page-home-root"
      style={{
        padding: 40,
        maxWidth: 700,
        margin: "0 auto",
        fontFamily: "sans-serif",
      }}
    >
      <h1 data-rpa-id="page-home-title">
        No-Code RPA Platform
      </h1>

      <p data-rpa-id="page-home-description" style={{ color: "#666" }}>
        フォーム作成・回答収集・RPA自動化プラットフォーム
      </p>

      {/* STATUS */}
      <div
        data-rpa-id="page-home-status-box"
        style={{
          padding: 20,
          border: "1px solid #ddd",
          borderRadius: 10,
          background: "#f8fafc",
          marginBottom: 30,
        }}
      >
        <h2 data-rpa-id="page-home-status-title">
          RPA Engine Status
        </h2>

        <p
          data-rpa-id="page-home-status-message"
          style={{ fontWeight: "bold" }}
        >
          {setupMessage}
        </p>

        {setupLoading && (
          <p data-rpa-id="page-home-setup-loading">
            初回セットアップ中...
          </p>
        )}

        {!setupLoading && setupFinished && (
          <div
            data-rpa-id="page-home-ready"
            style={{ color: "green", fontWeight: "bold" }}
          >
            RPA READY
          </div>
        )}
      </div>

      {/* DEBUG */}
      <a
        href="http://localhost/no-code-api/backend/debug.php"
        target="_blank"
        data-rpa-id="page-home-debug-link"
        style={{
          color: "red",
          display: "block",
          marginBottom: 20,
        }}
      >
        🔧 debug
      </a>

      {/* ACTIONS */}
      {setupFinished && (
        <div data-rpa-id="page-home-actions" style={{ marginBottom: 30 }}>
          <Link
            href="/create"
            id="rpa-create-link"
            data-rpa-id="page-home-create-link"
            style={{
              display: "block",
              padding: 16,
              background: "#2563eb",
              color: "#fff",
              textAlign: "center",
              borderRadius: 10,
              fontWeight: "bold",
            }}
          >
            ＋ フォーム作成
          </Link>

          {!recording && (
            <button
              onClick={handleRpaToggle}
              data-rpa-id="page-home-rpa-record-start"
              style={{
                marginTop: 10,
                width: "100%",
                padding: 16,
                background: "#7c3aed",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontWeight: "bold",
              }}
            >
              ▶ RPA記録開始
            </button>
          )}

          {recording && (
            <button
              onClick={handleRpaToggle}
              data-rpa-id="page-home-rpa-record-stop"
              style={{
                marginTop: 10,
                width: "100%",
                padding: 16,
                background: "#ef4444",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontWeight: "bold",
              }}
            >
              ■ RPA停止
            </button>
          )}
        </div>
      )}

      {/* STATE */}
      {loading && (
        <p data-rpa-id="page-home-loading">
          読み込み中...
        </p>
      )}

      {error && (
        <p data-rpa-id="page-home-error" style={{ color: "red" }}>
          {error}
        </p>
      )}

      {/* FORMS */}
      {!loading && !error && (
        <>
          <h2 data-rpa-id="page-home-forms-title">
            フォーム一覧
          </h2>

          {forms.length === 0 && (
            <p data-rpa-id="page-home-empty">
              まだフォームがありません
            </p>
          )}

          {forms.map((form) => (
            <div
              key={form.id}
              data-rpa-id={`page-home-form-${form.id}`}
              style={{
                border: "1px solid #ddd",
                padding: 16,
                marginBottom: 10,
                borderRadius: 10,
              }}
            >
              <h3 data-rpa-id={`page-home-form-${form.id}-title`}>
                {form.title}
              </h3>

              <p data-rpa-id={`page-home-form-${form.id}-description`}>
                {form.description}
              </p>

              <div style={{ display: "flex", gap: 12 }}>
                <Link
                  href={`/form/${form.id}`}
                  data-rpa-id={`page-home-form-${form.id}-answer`}
                >
                  回答
                </Link>

                <Link
                  href={`/answers/${form.id}`}
                  data-rpa-id={`page-home-form-${form.id}-answers`}
                >
                  回答一覧
                </Link>

                <a
                  href={`http://localhost/no-code-api/backend/export_csv.php?form_id=${form.id}`}
                  data-rpa-id={`page-home-form-${form.id}-csv`}
                >
                  CSV
                </a>
              </div>

              <p
                data-rpa-id={`page-home-form-${form.id}-created`}
                style={{ fontSize: 12, color: "#999" }}
              >
                作成日: {form.created_at}
              </p>
            </div>
          ))}
        </>
      )}
    </main>
  );
}