let steps: any[] = [];
let isRecording = false;

export function startRecorder() {
  console.log("RECORDER START");

  steps = [];
  isRecording = true;

  // ★重要：少し遅延させる（DOM確定待ち）
  setTimeout(() => {
    document.addEventListener("click", recordClick, true);
    document.addEventListener("input", recordInput, true);

    console.log("EVENT LISTENERS ATTACHED");
  }, 50);
}

export function stopRecorder() {
  console.log("RECORDER STOP");

  isRecording = false;

  document.removeEventListener("click", recordClick, true);
  document.removeEventListener("input", recordInput, true);
}

function recordClick(e: MouseEvent) {
  if (!isRecording) return;

  const target = e.target as HTMLElement;

  const selector =
    target.id
      ? `#${target.id}`
      : target.tagName.toLowerCase();

  steps.push({
    type: "click",
    selector,
    time: Date.now(),
  });

  console.log("CLICK:", selector);
}

function recordInput(e: Event) {
  if (!isRecording) return;

  const target = e.target as HTMLInputElement;

  steps.push({
    type: "input",
    selector: target.name || target.id,
    value: target.value,
    time: Date.now(),
  });

  console.log("INPUT:", target.value);
}

export function getSteps() {
  return steps;
}