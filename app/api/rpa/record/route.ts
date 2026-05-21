import { NextResponse } from "next/server";

let isRecording = false;
let steps: any[] = [];

export async function POST() {
  isRecording = true;
  steps = [];

  console.log("[RPA] recording started");

  return NextResponse.json({
    recording: true,
  });
}

export async function DELETE() {
  isRecording = false;

  console.log("[RPA] recording stopped");

  return NextResponse.json({
    recording: false,
    scenario: steps,
  });
}