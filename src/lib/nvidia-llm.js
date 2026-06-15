import axios from "axios";

/**
 * NVIDIA LLM Service
 *
 * Uses the NVIDIA NIM API with Mistral Large 3 (675B) as the default model.
 * All requests go through the NVIDIA chat completions endpoint (OpenAI-compatible).
 *
 * Environment variable required:
 *   NVIDIA_API_KEY — stored in .env (git-ignored)
 */

const INVOKE_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

const MODEL = "mistralai/mistral-large-3-675b-instruct-2512";

/**
 * Build the authorization headers for NVIDIA NIM.
 * The key is read at call-time so hot-reloading .env works in dev.
 */
function getHeaders({ stream = false } = {}) {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    throw new Error("NVIDIA_API_KEY is not set. Add it to your .env file.");
  }
  return {
    Authorization: `Bearer ${apiKey}`,
    Accept: stream ? "text/event-stream" : "application/json",
    "Content-Type": "application/json",
  };
}

/**
 * Default generation parameters — conservative, high-quality output.
 */
const DEFAULT_PARAMS = {
  max_tokens: 2048,
  temperature: 0.15,
  top_p: 1.0,
  frequency_penalty: 0.0,
  presence_penalty: 0.0,
};

/**
 * Send a chat completion request to NVIDIA NIM (non-streaming).
 *
 * @param {string|Array<{role:string, content:string}>} messages
 *   - A plain string is wrapped as a single user message.
 *   - An array of {role, content} objects is passed directly.
 * @param {object}  [opts]            Optional overrides.
 * @param {string}  [opts.model]      Model ID (defaults to Mistral Large 3).
 * @param {number}  [opts.maxTokens]  Max output tokens.
 * @param {number}  [opts.temperature]
 * @param {number}  [opts.topP]
 * @param {number}  [opts.frequencyPenalty]
 * @param {number}  [opts.presencePenalty]
 * @returns {Promise<object>} The full NVIDIA API response (OpenAI-compatible shape).
 */
export async function chatCompletion(messages, opts = {}) {
  // Normalise a plain string into the messages array format.
  const normalisedMessages =
    typeof messages === "string"
      ? [{ role: "user", content: messages }]
      : messages;

  const payload = {
    model: opts.model || MODEL,
    messages: normalisedMessages,
    max_tokens: opts.maxTokens ?? DEFAULT_PARAMS.max_tokens,
    temperature: opts.temperature ?? DEFAULT_PARAMS.temperature,
    top_p: opts.topP ?? DEFAULT_PARAMS.top_p,
    frequency_penalty: opts.frequencyPenalty ?? DEFAULT_PARAMS.frequency_penalty,
    presence_penalty: opts.presencePenalty ?? DEFAULT_PARAMS.presence_penalty,
    stream: false,
  };

  const { data } = await axios.post(INVOKE_URL, payload, {
    headers: getHeaders({ stream: false }),
    responseType: "json",
    timeout: 120_000, // 2-minute safety net
  });

  return data;
}

/**
 * Convenience helper — returns just the assistant's text reply.
 *
 * @param {string|Array} messages  See chatCompletion().
 * @param {object}       [opts]    See chatCompletion().
 * @returns {Promise<string>} The text content of the first choice.
 */
export async function chat(messages, opts = {}) {
  const response = await chatCompletion(messages, opts);
  return response?.choices?.[0]?.message?.content ?? "";
}

/**
 * Stream a chat completion to the caller.
 * Returns a web-standard ReadableStream that the Next.js Route Handler can
 * forward directly to the client as a `text/event-stream` response.
 *
 * @param {string|Array} messages  See chatCompletion().
 * @param {object}       [opts]    See chatCompletion().
 * @returns {Promise<ReadableStream>} SSE stream.
 */
export async function chatStream(messages, opts = {}) {
  const normalisedMessages =
    typeof messages === "string"
      ? [{ role: "user", content: messages }]
      : messages;

  const payload = {
    model: opts.model || MODEL,
    messages: normalisedMessages,
    max_tokens: opts.maxTokens ?? DEFAULT_PARAMS.max_tokens,
    temperature: opts.temperature ?? DEFAULT_PARAMS.temperature,
    top_p: opts.topP ?? DEFAULT_PARAMS.top_p,
    frequency_penalty: opts.frequencyPenalty ?? DEFAULT_PARAMS.frequency_penalty,
    presence_penalty: opts.presencePenalty ?? DEFAULT_PARAMS.presence_penalty,
    stream: true,
  };

  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    throw new Error("NVIDIA_API_KEY is not set. Add it to your .env file.");
  }

  // Use native fetch for streaming so we get a web-standard ReadableStream.
  const response = await fetch(INVOKE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `NVIDIA API error ${response.status}: ${errorBody}`
    );
  }

  return response.body;
}

export default {
  chatCompletion,
  chat,
  chatStream,
  MODEL,
};
