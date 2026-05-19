import { NextResponse } from "next/server";

export async function POST() {
  const scenario = [
    {
      type: "navigate",
      url: "http://localhost:3000",
    },
    {
      type: "click",
      selector: "#example",
    },
  ];

  // TODO: DB保存
  console.log("RECORDED:", scenario);

  return NextResponse.json({
    status: "success",
    scenario,
  });
}