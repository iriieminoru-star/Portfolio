"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { startRecorder, stopRecorder, getSteps } from "./recorder";

type Scenario = {
  id?: string;
  name: string;
  code: string;
  created_at?: string;
};

type Log = {
  message: string;
  status: "success" | "error" | "info";
  time: string;
};

export default function RPAPage() {
  const router = useRouter();

  const [loadingRun, setLoadingRun] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingRecord, setLoadingRecord] = useState(false);

  const [message, setMessage] = useState("");
  const [scenarioName, setScenarioName] = useState("");
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  // =========================
  // ログ追加
  // =========================
  const addLog = (message: string, status: Log["status"]) => {
    setLogs((prev) => [
      {
        message,
        status,
        time: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);
  };

  // =========================
  // シナリオ取得
  // =========================
  const fetchScenarios = async () => {
    try {
      const res = await fetch(
        "http://localhost/no-code-api/backend/get_scenarios.php"
      );
      const data = await res.json();
      setScenarios(data);
    } catch (err) {
      console.error(err);
      addLog("シナリオ取得エラー", "error");
    }
  };

  // =========================
  // 削除
  // =========================
  const deleteScenario = async (id?: string) => {
    if (!id) return;

    try {
      const res = await fetch(
        "http://localhost/no-code-api/backend/delete_scenario.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        }
      );

      const data = await res.json();

      if (data.status === "success") {
        addLog("削除成功", "success");
        fetchScenarios();
      } else {
        addLog("削除失敗", "error");
      }
    } catch {
      addLog("削除エラー", "error");
    }
  };

  // =========================
  // 記録開始
  // =========================
  const startRecord = () => {
    setLoadingRecord(true);
    setMessage("記録開始");

    startRecorder();

    addLog("記録開始", "info");
  };

  // =========================
  // 記録停止
  // =========================
  const stopRecord = () => {
    setLoadingRecord(false);
    setMessage("記録停止");

    stopRecorder();

    const steps = getSteps();
    console.log("RECORDED STEPS =", steps);

    addLog("記録停止", "info");
    addLog(`ステップ数: ${steps.length}`, "success");
  };

  // =========================
  // 保存
  // =========================
  const saveScenario = async () => {
    try {
      setLoadingSave(true);
      setMessage("保存中...");

      const steps = getSteps();

      const res = await fetch(
        "http://localhost/no-code-api/backend/save_scenario.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: scenarioName,
            code: JSON.stringify(steps),
          }),
        }
      );

      const data = await res.json();

      if (data.status === "success") {
        setMessage("保存成功");
        addLog("保存成功", "success");

        setScenarioName("");
        fetchScenarios();
      } else {
        setMessage("保存失敗");
        addLog("保存失敗", "error");
      }
    } catch {
      setMessage("通信エラー");
      addLog("保存エラー", "error");
    } finally {
      setLoadingSave(false);
    }
  };

  // =========================
  // 実行
  // =========================
  const runRPA = async () => {
    try {
      setLoadingRun(true);
      setMessage("実行中...");

      const res = await fetch("/api/rpa/run", {
        method: "POST",
      });

      const data = await res.json();

      if (data.status === "success") {
        setMessage("実行完了");
        addLog("実行成功", "success");

        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        setMessage("実行失敗");
        addLog("実行失敗", "error");
      }
    } catch {
      setMessage("実行エラー");
      addLog("実行エラー", "error");
    } finally {
      setLoadingRun(false);
    }
  };

  const startRecord = async () => {
    setIsRecording(true);
    setMessage("記録開始中");

    startRecorder();

    addLog("記録開始", "info");

    console.log("▶ RECORDING STARTED");
  };

  useEffect(() => {
    fetchScenarios();
  }, []);

  const stopRecord = () => {
    setIsRecording(false);
    setMessage("記録停止");

    stopRecorder();

    const steps = getSteps();
    console.log("RECORDED STEPS =", steps);

    addLog(`記録停止（${steps.length}件）`, "success");
  };

  return (
    <main style={{ padding: 40, maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ fontSize: 32 }}>RPA管理画面</h1>

      <button onClick={startRecord} disabled={loadingRecord}>
        {loadingRecord ? "記録中..." : "▶ 記録開始"}
      </button>

      <button onClick={stopRecord} disabled={!loadingRecord}>
        ■ 停止
      </button>

      <button onClick={runRPA} disabled={loadingRun}>
        {loadingRun ? "実行中..." : "▶ 実行"}
      </button>

      <div style={{ marginTop: 20 }}>
        <input
          value={scenarioName}
          onChange={(e) => setScenarioName(e.target.value)}
          placeholder="シナリオ名"
        />

        <button onClick={saveScenario} disabled={loadingSave}>
          {loadingSave ? "保存中..." : "保存"}
        </button>
      </div>

      <h2>シナリオ一覧</h2>

      {scenarios.map((s, i) => (
        <div key={s.id ?? i}>
          <div>名前: {s.name}</div>
          <div>コード: {s.code}</div>
          <button onClick={() => deleteScenario(s.id)}>削除</button>
        </div>
      ))}

      <h2>ログ</h2>

      {isRecording && (
        <div style={{ color: "red", fontWeight: "bold" }}>
          ● RECORDER ACTIVE
        </div>
      )}


      {logs.map((l, i) => (
        <div key={i}>
          [{l.time}] {l.message}
        </div>
      ))}


      <p>{message}</p>
    </main>
  );
}