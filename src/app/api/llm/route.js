import { chatCompletion, chatStream } from "@/lib/nvidia-llm";

/**
 * POST /api/llm
 *
 * Send a chat request to the NVIDIA LLM (Mistral Large 3).
 *
 * Request body (JSON):
 *   {
 *     "messages": "Hello!" | [{ role: "user", content: "..." }, ...],
 *     "stream":   false,        // optional — set true for SSE streaming
 *     "maxTokens": 2048,        // optional
 *     "temperature": 0.15       // optional
 *   }
 *
 * Responses:
 *   200  — { content: "..." }                (non-streaming)
 *   200  — text/event-stream                 (streaming)
 *   400  — { error: "..." }                  (bad request)
 *   500  — { error: "..." }                  (server error)
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { messages, stream = false, maxTokens, temperature } = body;

    // --- Validation ---
    if (!messages) {
      return Response.json(
        { error: "Missing required field: messages" },
        { status: 400 }
      );
    }

    // --- Streaming response ---
    if (stream) {
      const streamBody = await chatStream(messages, { maxTokens, temperature });

      return new Response(streamBody, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    // --- Non-streaming response ---
    const result = await chatCompletion(messages, { maxTokens, temperature });
    const content = result?.choices?.[0]?.message?.content ?? "";

    return Response.json({ content });
  } catch (error) {
    console.error("[API /api/llm]", error?.message || error);

    // Surface a meaningful error to the client without leaking secrets.
    const status = error?.response?.status ?? 500;
    const message =
      status === 401
        ? "Invalid NVIDIA API key."
        : `LLM request failed: ${error?.message || "Unknown error"}`;

    return Response.json({ error: message }, { status });
  }
}
