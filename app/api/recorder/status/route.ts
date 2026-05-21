let isRecording = false;

export async function GET() {
  return Response.json({
    recording: isRecording,
  });
}