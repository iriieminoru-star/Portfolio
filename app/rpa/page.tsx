"use client";

import { useEffect, useState } from "react";
import {
  startRecorder,
  stopRecorder,
  getSteps,
  RecorderStep,
} from "./recorder";

type Scenario = {
  scenario_id: string;
  name: string;
  created_at: string;
  steps: RecorderStep[];
};

const STORAGE_KEY = "rpa_scenarios";

export default function RPAPage() {
  const [recording, setRecording] = useState(false);
  const [steps, setSteps] = useState<RecorderStep[]>([]);
  const [name, setName] = useState("");
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [log, setLog] = useState("待機中");

  // =========================
  // 初期化（シンプル版）
  // =========================
  useEffect(() => {
    console.log("[RPA] home loaded");

    setSteps(getSteps());
    loadScenarios();
  }, []);

  // =========================
  // load
  // =========================
  const loadScenarios = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setScenarios(raw ? JSON.parse(raw) : []);
    } catch {
      setScenarios([]);
    }
  };

  // =========================
  // save
  // =========================
  const saveScenario = (scenario: Scenario) => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];

    list.push(scenario);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    setScenarios(list);
  };

  // =========================
  // start
  // =========================
  const handleStart = () => {
    startRecorder();
    setRecording(true);
    setLog("録画中...");
  };

  // =========================
  // stop
  // =========================
  const handleStop = () => {
    const recorded = stopRecorder();

    setSteps(recorded);
    setRecording(false);

    saveScenario({
      scenario_id: crypto.randomUUID(),
      name: name || "unnamed",
      created_at: new Date().toISOString(),
      steps: recorded,
    });

    setLog("保存完了");
  };

  // =========================
  // replay
  // =========================
  const handleReplay = (id: string) => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];

    const scenario = list.find(
      (s: Scenario) => s.scenario_id === id
    );

    if (!scenario) {
      setLog("再生失敗");
      return;
    }

    setLog("再生中...");

    let i = 0;

    const run = () => {
      if (i >= scenario.steps.length) {
        setLog("再生完了");
        return;
      }

      console.log("[RPA REPLAY]", scenario.steps[i]);

      i++;
      setTimeout(run, 200);
    };

    run();
  };

  // =========================
  // UI
  // =========================
  return (
    <div style={{ padding: 20 }}>
      <h1>RPA Recorder</h1>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="シナリオ名"
      />

      <div style={{ marginTop: 10 }}>
        {!recording ? (
          <button onClick={handleStart}>▶ 記録開始</button>
        ) : (
          <button onClick={handleStop}>■ 停止して保存</button>
        )}
      </div>

      <p>{log}</p>
      <p>steps: {steps.length}</p>

      <hr />

      <h3>保存済み</h3>

      {scenarios.length === 0 && <p>まだシナリオなし</p>}

      {scenarios.map((sc) => (
        <div key={sc.scenario_id}>
          <p>{sc.name}</p>
          <button onClick={() => handleReplay(sc.scenario_id)}>
            ▶ 再生
          </button>
        </div>
      ))}
    </div>
  );
}