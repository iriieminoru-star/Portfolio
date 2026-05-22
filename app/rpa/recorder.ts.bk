export type RecorderStep = {
  step_index: number;
  type: "click" | "type" | "goto";
  selector?: string | null;
  value?: string | null;
  url?: string | null;
};

const STORAGE_RECORDING = "rpa_recording";
const STORAGE_STEPS = "rpa_steps";

let isRecording = false;
let steps: RecorderStep[] = [];

// =========================
// load
// =========================
function loadSteps(): RecorderStep[] {
  try {
    const raw = localStorage.getItem(STORAGE_STEPS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// =========================
// save
// =========================
function saveSteps() {
  localStorage.setItem(STORAGE_STEPS, JSON.stringify(steps));
}

// =========================
// start
// =========================
export function startRecorder() {
  console.log("[RPA] recorder start");

  isRecording = true;
  steps = [];

  localStorage.setItem(STORAGE_RECORDING, "true");
  localStorage.removeItem(STORAGE_STEPS);

  steps.push({
    step_index: 0,
    type: "goto",
    url: window.location.href,
  });

  saveSteps();

  window.addEventListener("click", handleClick, true);
  window.addEventListener("input", handleInput, true);

  console.log("[RPA] started recording");
}

// =========================
// stop
// =========================
export function stopRecorder() {
  console.log("[RPA] recorder stop");

  isRecording = false;
  localStorage.removeItem(STORAGE_RECORDING);

  window.removeEventListener("click", handleClick, true);
  window.removeEventListener("input", handleInput, true);

  steps = loadSteps();

  console.log("[RPA] stopped steps:", steps.length);

  return steps;
}

// =========================
// status
// =========================
export function isRecorderRunning() {
  return localStorage.getItem(STORAGE_RECORDING) === "true";
}

export function getSteps() {
  return loadSteps();
}

// =========================
// click
// =========================
function handleClick(e: MouseEvent) {
  if (!isRecording) return;

  const target = e.target as HTMLElement;

  const ignoreTags = ["html", "body", "div", "span", "p"];
  if (ignoreTags.includes(target.tagName.toLowerCase())) return;

  const step: RecorderStep = {
    step_index: steps.length,
    type: "click",
    selector: getSelector(target),
    value: null,
    url: null,
  };

  steps.push(step);
  saveSteps();

  console.log("[RPA] click recorded");
}

// =========================
// input
// =========================
function handleInput(e: Event) {
  if (!isRecording) return;

  const target = e.target as HTMLInputElement;
  if (!target || typeof target.value !== "string") return;

  const selector = getSelector(target);

  const last = steps[steps.length - 1];

  if (last && last.type === "type" && last.selector === selector) {
    last.value = target.value;
    saveSteps();
    return;
  }

  steps.push({
    step_index: steps.length,
    type: "type",
    selector,
    value: target.value,
    url: null,
  });

  saveSteps();
}

// =========================
// selector
// =========================
function getSelector(el: HTMLElement): string {
  if (el.id) return `#${el.id}`;

  const name = el.getAttribute("name");
  if (name) return `[name="${name}"]`;

  const testid = el.getAttribute("data-testid");
  if (testid) return `[data-testid="${testid}"]`;

  if (typeof el.className === "string" && el.className.trim()) {
    return `${el.tagName.toLowerCase()}.${el.className.split(" ")[0]}`;
  }

  return el.tagName.toLowerCase();
}