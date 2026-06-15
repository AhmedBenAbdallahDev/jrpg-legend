import axios from "axios";

/**
 * NVIDIA LLM Service — OPTIONAL, never blocks deployment.
 *
 * Uses the NVIDIA NIM API with Mistral Large 3 (675B) as the default model.
 * All requests go through the NVIDIA chat completions endpoint (OpenAI-compatible).
 *
 * This module is safe to import even when NVIDIA_API_KEY is not set.
 * All functions check for the key at call-time and return structured errors
 * instead of throwing — so the rest of the app keeps working normally.
 *
 * Environment variable (optional):
 *   NVIDIA_API_KEY — stored in .env (git-ignored)
 */

const INVOKE_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

const MODEL = "mistralai/mistral-large-3-675b-instruct-2512";

/**
 * Check whether the NVIDIA LLM is configured and ready to use.
 * Call this before any LLM function to decide whether to offer AI features.
 *
 * @returns {boolean} true if NVIDIA_API_KEY is set.
 */
export function isConfigured() {
  return !!process.env.NVIDIA_API_KEY;
}

/**
 * Read the API key at call-time (so hot-reloading .env works in dev).
 * Returns the key or null — never throws.
 */
function getApiKey() {
  return process.env.NVIDIA_API_KEY || null;
}

/**
 * Build the authorization headers for NVIDIA NIM.
 * Returns null if the key is missing (caller decides what to do).
 */
function getHeaders({ stream = false } = {}) {
  const apiKey = getApiKey();
  if (!apiKey) return null;
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
  // Graceful: return a clear error object instead of throwing.
  const headers = getHeaders({ stream: false });
  if (!headers) {
    return { error: true, status: 503, message: "AI features are not configured. Set NVIDIA_API_KEY in your .env file." };
  }

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

  try {
    const { data } = await axios.post(INVOKE_URL, payload, {
      headers,
      responseType: "json",
      timeout: 120_000, // 2-minute safety net
    });
    return data;
  } catch (err) {
    const status = err?.response?.status ?? 500;
    return { error: true, status, message: `NVIDIA API error: ${err?.message || "Unknown"}` };
  }
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
  // If chatCompletion returned an error object, propagate it.
  if (response?.error) return response;
  return { content: response?.choices?.[0]?.message?.content ?? "" };
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
  // Graceful: throw a clear error — the caller (API route) catches it.
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("AI features are not configured. Set NVIDIA_API_KEY in your .env file.");
  }

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
  isConfigured,
  chatCompletion,
  chat,
  chatStream,
  MODEL,
};
