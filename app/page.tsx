"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  isRecorderRunning,
  startRecorder,
  stopRecorder,
} from "./rpa/recorder";

// ============================================================
// 既存の型（変更なし）
// ============================================================
type Form = {
  id: string;
  title: string;
  description: string;
  created_at: string;
};

// ============================================================
// [追加] RPA シナリオ用型定義
// ============================================================
type Step =
  | { type: "click"; selector: string; timestamp: number }
  | { type: "input"; selector: string; value: string; timestamp: number };

type Scenario = {
  id: string;
  name: string;
  steps: Step[];
  createdAt: string;
};

// ============================================================
// [追加] localStorage キー（既存キーと衝突しない）
// ============================================================
const RPA_SCENARIOS_KEY = "rpa_scenarios";

// ============================================================
// [追加] シナリオ一覧を localStorage から読み込む
// ============================================================
function loadScenarios(): Scenario[] {
  try {
    const raw = localStorage.getItem(RPA_SCENARIOS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// ============================================================
// [追加] シナリオ一覧を localStorage に保存する
// ============================================================
function saveScenarios(scenarios: Scenario[]): void {
  localStorage.setItem(RPA_SCENARIOS_KEY, JSON.stringify(scenarios));
}

// ============================================================
// [追加] 既存 RecorderStep → Step 変換
// recorder.ts は "click" / "type" / "goto" を使っているため変換する
// ============================================================
function convertToSteps(recorderSteps: ReturnType<typeof stopRecorder>): Step[] {
  const now = Date.now();
  const result: Step[] = [];

  for (const rs of recorderSteps) {
    if (rs.type === "click" && rs.selector) {
      result.push({ type: "click", selector: rs.selector, timestamp: now });
    } else if (rs.type === "type" && rs.selector && rs.value != null) {
      result.push({ type: "input", selector: rs.selector, value: rs.value, timestamp: now });
    }
    // "goto" は DOM 操作で再現できないためスキップ
  }

  return result;
}

// ============================================================
// [追加] ブラウザ内再生ロジック（delayMs: ステップ間の待機ミリ秒）
// document.querySelector で要素を探し、失敗したステップはスキップして続行
// ============================================================
async function playScenarioInBrowser(scenario: Scenario, delayMs: number): Promise<void> {
  console.log("[RPA] browser play start:", scenario.name, "delay:", delayMs);

  for (const step of scenario.steps) {
    // 指定された遅延を待機（速度スライダーの値がここに反映される）
    await new Promise((resolve) => setTimeout(resolve, delayMs));

    try {
      const el = document.querySelector(step.selector);

      if (!el) {
        console.warn("[RPA] selector not found, skip:", step.selector);
        continue;
      }

      if (step.type === "click") {
        (el as HTMLElement).click();
        console.log("[RPA] click:", step.selector);
      } else if (step.type === "input") {
        // React の合成イベントに対応するため nativeInputValueSetter 経由でセット
        const inputEl = el as HTMLInputElement;
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value"
        )?.set;
        if (nativeInputValueSetter) {
          nativeInputValueSetter.call(inputEl, step.value);
        } else {
          inputEl.value = step.value;
        }
        inputEl.dispatchEvent(new Event("input", { bubbles: true }));
        inputEl.dispatchEvent(new Event("change", { bubbles: true }));
        console.log("[RPA] input:", step.selector, "=", step.value);
      }
    } catch (err) {
      console.warn("[RPA] step error, skip:", step.selector, err);
    }
  }

  console.log("[RPA] browser play done:", scenario.name);
}

// ============================================================
// [追加] Playwright 再生ロジック（API経由・delayMs を渡す）
// /api/rpa/replay に steps と delay を POST する
// ============================================================
async function playScenarioWithPlaywright(scenario: Scenario, delayMs: number): Promise<void> {
  console.log("[RPA] playwright play start:", scenario.name, "delay:", delayMs);

  const res = await fetch("/api/rpa/replay", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      steps: scenario.steps,
      delay: delayMs,
    }),
  });

  const data = await res.json();

  if (data.status !== "success") {
    throw new Error(data.message || "Playwright 再生失敗");
  }

  console.log("[RPA] playwright play done:", scenario.name);
}

// ============================================================
// メインコンポーネント
// ============================================================
export default function HomePage() {
  // ---- 既存 state（変更なし） ----
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [setupLoading, setSetupLoading] = useState(true);
  const [setupFinished, setSetupFinished] = useState(false);
  const [setupMessage, setSetupMessage] = useState("RPA Engine 初期化中...");
  const [recording, setRecording] = useState(false);

  // ---- [追加] シナリオ一覧 state ----
  const [scenarios, setScenarios] = useState<Scenario[]>([]);

  // ---- [追加] 再生中のシナリオ ID（二重押し防止用） ----
  const [playingId, setPlayingId] = useState<string | null>(null);

  // ---- [追加] 再生モード: "browser" = ブラウザ内, "playwright" = Playwright ----
  const [playMode, setPlayMode] = useState<"browser" | "playwright">("browser");

  // ---- [追加] 速度スライダー: 100ms〜3000ms、デフォルト 500ms ----
  const [delayMs, setDelayMs] = useState<number>(500);

  // ---- [追加] 再生エラーメッセージ ----
  const [playError, setPlayError] = useState<string | null>(null);

  // ============================================================
  // 既存 useEffect: ページロードログ（変更なし）
  // ============================================================
  useEffect(() => {
    console.log("[RPA] home loaded");
  }, []);

  // ============================================================
  // 既存 useEffect: 記録状態の復元
  // [追加] シナリオ一覧の復元を同じタイミングで行う
  // ============================================================
  useEffect(() => {
    const running = isRecorderRunning();
    setRecording(running);
    console.log("[RPA] restore recording:", running);

    // [追加] localStorage からシナリオ一覧を復元
    const saved = loadScenarios();
    setScenarios(saved);
    console.log("[RPA] restore scenarios:", saved.length);
  }, []);

  // ============================================================
  // 既存 useEffect: Playwright セットアップ（変更なし）
  // ============================================================
  useEffect(() => {
    const setupPlaywright = async () => {
      try {
        console.log("PLAYWRIGHT SETUP START");
        setSetupLoading(true);

        const res = await fetch("/api/setup", { method: "POST" });
        const text = await res.text();

        if (text.startsWith("<!DOCTYPE") || text.startsWith("<html")) {
          setSetupMessage("⚠ /api/setup が見つかりません");
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

  // ============================================================
  // 既存 useEffect: フォーム一覧フェッチ（変更なし）
  // ============================================================
  useEffect(() => {
    const fetchForms = async () => {
      try {
        setError(null);
        console.log("[RPA] forms fetch start");

        const res = await fetch("http://localhost/no-code-api/backend/get_forms.php");
        const data = await res.json();

        if (data.status === "success") {
          setForms(data.forms);
        } else {
          throw new Error(data.message || "取得失敗");
        }
      } catch (err: any) {
        // "Failed to fetch" はネットワーク到達不可（サーバー未起動など）のときに発生する
        if (err instanceof TypeError && err.message === "Failed to fetch") {
          setError("⚠ バックエンドに接続できません。XAMPPのApacheが起動しているか確認してください。");
        } else {
          setError(err.message || "通信エラー");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  // ============================================================
  // 既存ハンドラ: RPA 記録トグル
  // [変更] 停止時に localStorage へ Scenario として保存
  // ============================================================
  const handleRpaToggle = async () => {
    if (recording) {
      const result = stopRecorder();
      console.log("RECORDED:", result);

      const steps = convertToSteps(result);

      if (steps.length > 0) {
        const newScenario: Scenario = {
          id: crypto.randomUUID(),
          name: `シナリオ_${new Date().toLocaleString("ja-JP")}`,
          steps,
          createdAt: new Date().toISOString(),
        };

        const updated = [...scenarios, newScenario];
        setScenarios(updated);
        saveScenarios(updated);
        console.log("[RPA] scenario saved:", newScenario.id, "steps:", steps.length);
      } else {
        console.log("[RPA] no steps recorded, scenario not saved");
      }

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

  // ============================================================
  // [追加] シナリオ削除ハンドラ
  // ============================================================
  const handleDeleteScenario = (id: string) => {
    const updated = scenarios.filter((s) => s.id !== id);
    setScenarios(updated);
    saveScenarios(updated);
    console.log("[RPA] scenario deleted:", id);
  };

  // ============================================================
  // [追加] シナリオ再生ハンドラ
  // playMode に応じてブラウザ内再生 or Playwright 再生を切り替え
  // ============================================================
  const handlePlayScenario = async (scenario: Scenario) => {
    if (playingId) return;

    setPlayingId(scenario.id);
    setPlayError(null);

    try {
      if (playMode === "playwright") {
        // Playwright モード: Node.js サーバー経由で実際のブラウザを操作
        await playScenarioWithPlaywright(scenario, delayMs);
      } else {
        // ブラウザモード: 現在のページ上で直接 DOM 操作
        await playScenarioInBrowser(scenario, delayMs);
      }
    } catch (err: any) {
      const msg = err.message || "再生エラー";
      setPlayError(msg);
      console.error("[RPA] play error:", msg);
    } finally {
      setPlayingId(null);
    }
  };

  // ============================================================
  // 速度スライダーのラベル表示用ヘルパー
  // ============================================================
  const delayLabel = (): string => {
    if (delayMs <= 200) return "⚡ 最速";
    if (delayMs <= 500) return "🐇 速い";
    if (delayMs <= 1000) return "🚶 普通";
    if (delayMs <= 2000) return "🐢 ゆっくり";
    return "🐌 最遅";
  };

  // ============================================================
  // JSX（既存 UI を維持したまま末尾に RPA セクションを追加）
  // ============================================================
  return (
    <main
      data-rpa-id="page-home-root"
      style={{ padding: 40, maxWidth: 700, margin: "0 auto", fontFamily: "sans-serif" }}
    >
      {/* ---- 既存: タイトル（変更なし） ---- */}
      <h1 data-rpa-id="page-home-title">No-Code RPA Platform</h1>

      <p data-rpa-id="page-home-description" style={{ color: "#666" }}>
        フォーム作成・回答管理・RPA自動化プラットフォーム
      </p>

      {/* ---- 既存: STATUS ブロック（変更なし） ---- */}
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
        <h2 data-rpa-id="page-home-status-title">RPA Engine Status</h2>

        <p data-rpa-id="page-home-status-message" style={{ fontWeight: "bold" }}>
          {setupMessage}
        </p>

        {setupLoading && (
          <p data-rpa-id="page-home-setup-loading">初期セットアップ中...</p>
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

      {/* ---- 既存: DEBUG リンク（変更なし） ---- */}
      <a
        href="http://localhost/no-code-api/backend/debug.php"
        target="_blank"
        data-rpa-id="page-home-debug-link"
        style={{ color: "red", display: "block", marginBottom: 20 }}
      >
        🔗 debug
      </a>

      {/* ---- 既存: ACTIONS ブロック（変更なし） ---- */}
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
              id="page-home-rpa-record-start"
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
                cursor: "pointer",
              }}
            >
              ⏺ RPA 記録開始
            </button>
          )}

          {recording && (
            <button
              onClick={handleRpaToggle}
              id="page-home-rpa-record-stop"
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
                cursor: "pointer",
              }}
            >
              ⏹ RPA停止
            </button>
          )}
        </div>
      )}

      {/* ---- 既存: ローディング・エラー表示（変更なし） ---- */}
      {loading && <p data-rpa-id="page-home-loading">読み込み中...</p>}

      {error && (
        <p data-rpa-id="page-home-error" style={{ color: "red" }}>
          {error}
        </p>
      )}

      {/* ---- 既存: フォーム一覧（変更なし） ---- */}
      {!loading && !error && (
        <>
          <h2 data-rpa-id="page-home-forms-title">フォーム一覧</h2>

          {forms.length === 0 && (
            <p data-rpa-id="page-home-empty">まだフォームがありません</p>
          )}

          {forms.map((form) => (
            <div
              key={form.id}
              data-rpa-id={`page-home-form-${form.id}`}
              style={{ border: "1px solid #ddd", padding: 16, marginBottom: 10, borderRadius: 10 }}
            >
              <h3 data-rpa-id={`page-home-form-${form.id}-title`}>{form.title}</h3>
              <p data-rpa-id={`page-home-form-${form.id}-description`}>{form.description}</p>

              <div style={{ display: "flex", gap: 12 }}>
                <Link href={`/form/${form.id}`} data-rpa-id={`page-home-form-${form.id}-answer`}>
                  回答
                </Link>
                <Link href={`/answers/${form.id}`} data-rpa-id={`page-home-form-${form.id}-answers`}>
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

      {/* ============================================================
          [追加] RPA シナリオ一覧セクション（既存 UI の下に追加）
          ============================================================ */}
      <div
        data-rpa-id="page-home-rpa-scenarios"
        style={{ marginTop: 40, paddingTop: 24, borderTop: "2px solid #e5e7eb" }}
      >
        <h2 data-rpa-id="page-home-rpa-scenarios-title" style={{ marginBottom: 16 }}>
          🤖 RPA シナリオ一覧
        </h2>

        {/* ---- [追加] 再生設定パネル ---- */}
        <div
          data-rpa-id="page-home-rpa-play-settings"
          style={{
            padding: 16,
            background: "#f8fafc",
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            marginBottom: 20,
          }}
        >
          <div style={{ fontWeight: "bold", fontSize: 13, marginBottom: 12, color: "#374151" }}>
            ⚙ 再生設定
          </div>

          {/* 再生モード切り替え */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>再生モード</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setPlayMode("browser")}
                data-rpa-id="page-home-rpa-mode-browser"
                style={{
                  padding: "6px 14px",
                  borderRadius: 6,
                  border: "1px solid",
                  borderColor: playMode === "browser" ? "#2563eb" : "#d1d5db",
                  background: playMode === "browser" ? "#eff6ff" : "#fff",
                  color: playMode === "browser" ? "#2563eb" : "#6b7280",
                  fontWeight: playMode === "browser" ? "bold" : "normal",
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                🖥 ブラウザ内
              </button>
              <button
                onClick={() => setPlayMode("playwright")}
                data-rpa-id="page-home-rpa-mode-playwright"
                style={{
                  padding: "6px 14px",
                  borderRadius: 6,
                  border: "1px solid",
                  borderColor: playMode === "playwright" ? "#7c3aed" : "#d1d5db",
                  background: playMode === "playwright" ? "#f5f3ff" : "#fff",
                  color: playMode === "playwright" ? "#7c3aed" : "#6b7280",
                  fontWeight: playMode === "playwright" ? "bold" : "normal",
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                🎭 Playwright
              </button>
            </div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 6 }}>
              {playMode === "browser"
                ? "現在開いているページ上で DOM を直接操作します"
                : "Node.js サーバー経由で別ブラウザウィンドウを起動して操作します"}
            </div>
          </div>

          {/* 速度スライダー */}
          <div>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>
              ステップ間の待機時間　{delayLabel()}　<strong>{delayMs}ms</strong>
            </div>
            <input
              type="range"
              min={100}
              max={3000}
              step={100}
              value={delayMs}
              onChange={(e) => setDelayMs(Number(e.target.value))}
              data-rpa-id="page-home-rpa-delay-slider"
              style={{ width: "100%", accentColor: "#2563eb", cursor: "pointer" }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 11,
                color: "#9ca3af",
                marginTop: 2,
              }}
            >
              <span>⚡ 100ms（最速）</span>
              <span>🐌 3000ms（最遅）</span>
            </div>
          </div>
        </div>

        {/* 再生エラー表示 */}
        {playError && (
          <div
            data-rpa-id="page-home-rpa-play-error"
            style={{
              padding: "10px 16px",
              background: "#fef2f2",
              border: "1px solid #fca5a5",
              borderRadius: 8,
              color: "#dc2626",
              fontSize: 13,
              marginBottom: 16,
            }}
          >
            ❌ {playError}
          </div>
        )}

        {/* 記録中のインジケーター */}
        {recording && (
          <div
            data-rpa-id="page-home-recording-indicator"
            style={{
              padding: "10px 16px",
              background: "#fef2f2",
              border: "1px solid #fca5a5",
              borderRadius: 8,
              color: "#dc2626",
              fontWeight: "bold",
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>●</span>
            記録中... 操作が記録されています
          </div>
        )}

        {/* シナリオが 0 件のとき */}
        {scenarios.length === 0 ? (
          <p
            data-rpa-id="page-home-rpa-scenarios-empty"
            style={{ color: "#9ca3af", fontSize: 14 }}
          >
            保存済みシナリオがありません。記録開始ボタンで操作を記録してください。
          </p>
        ) : (
          <ul
            data-rpa-id="page-home-rpa-scenarios-list"
            style={{ listStyle: "none", padding: 0, margin: 0 }}
          >
            {scenarios.map((scenario) => (
              <li
                key={scenario.id}
                data-rpa-id={`page-home-rpa-scenario-${scenario.id}`}
                style={{
                  border: "1px solid #d1d5db",
                  borderRadius: 10,
                  padding: 16,
                  marginBottom: 12,
                  background: playingId === scenario.id ? "#f0fdf4" : "#fff",
                  transition: "background 0.3s",
                }}
              >
                {/* シナリオ名 */}
                <div style={{ fontWeight: "bold", fontSize: 15, marginBottom: 4 }}>
                  {scenario.name}
                </div>

                {/* メタ情報 */}
                <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 12 }}>
                  ステップ数: {scenario.steps.length} ／
                  作成日時: {new Date(scenario.createdAt).toLocaleString("ja-JP")}
                </div>

                {/* ステップ概要（最大 5 件表示） */}
                {scenario.steps.length > 0 && (
                  <ul
                    style={{
                      fontSize: 12,
                      color: "#374151",
                      padding: "0 0 0 16px",
                      margin: "0 0 12px 0",
                    }}
                  >
                    {scenario.steps.slice(0, 5).map((step, idx) => (
                      <li key={idx} style={{ marginBottom: 2 }}>
                        {step.type === "click"
                          ? `🖱 click: ${step.selector}`
                          : `⌨ input: ${step.selector} = "${step.value}"`}
                      </li>
                    ))}
                    {scenario.steps.length > 5 && (
                      <li style={{ color: "#9ca3af" }}>
                        ...他 {scenario.steps.length - 5} ステップ
                      </li>
                    )}
                  </ul>
                )}

                {/* 操作ボタン */}
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {/* 再生ボタン */}
                  <button
                    onClick={() => handlePlayScenario(scenario)}
                    disabled={playingId !== null}
                    data-rpa-id={`page-home-rpa-scenario-${scenario.id}-play`}
                    style={{
                      padding: "8px 18px",
                      background: playingId === scenario.id ? "#6b7280" : "#10b981",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      fontWeight: "bold",
                      cursor: playingId !== null ? "not-allowed" : "pointer",
                      fontSize: 13,
                    }}
                  >
                    {playingId === scenario.id ? "⏳ 再生中..." : "▶ 再生"}
                  </button>

                  {/* 削除ボタン */}
                  <button
                    onClick={() => handleDeleteScenario(scenario.id)}
                    disabled={playingId === scenario.id}
                    data-rpa-id={`page-home-rpa-scenario-${scenario.id}-delete`}
                    style={{
                      padding: "8px 18px",
                      background: "#f3f4f6",
                      color: "#ef4444",
                      border: "1px solid #fca5a5",
                      borderRadius: 8,
                      cursor: playingId === scenario.id ? "not-allowed" : "pointer",
                      fontSize: 13,
                    }}
                  >
                    🗑 削除
                  </button>

                  {/* 再生中のステップ進捗表示 */}
                  {playingId === scenario.id && (
                    <span style={{ fontSize: 12, color: "#6b7280" }}>
                      {delayMs}ms 間隔で実行中...
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* ============================================================
          [追加ここまで]
          ============================================================ */}
    </main>
  );
}
