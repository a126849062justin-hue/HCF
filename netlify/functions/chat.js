const { HCF_SYSTEM_PROMPT } = require("./shared-config");

// Use only Gemini REST endpoint to reduce SDK/ESM compatibility issues.
const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

async function tryGeminiAPI(message) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  console.log("\uD83D\uDCCD \u5617\u8A66 Gemini REST API...");

  const url = `${GEMINI_ENDPOINT}?key=${process.env.GEMINI_API_KEY}`;

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${HCF_SYSTEM_PROMPT}\n\n\u7528\u6236: ${message}`,
            },
          ],
        },
      ],
    }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Gemini API error (${resp.status}): ${text}`);
  }

  const data = await resp.json();
  const reply =
    data?.candidates?.[0]?.content?.parts
      ?.map((p) => p.text || "")
      .join("") || "";

  if (!reply) {
    throw new Error("Gemini API returned empty reply");
  }

  console.log("\u2705 Gemini \u6210\u529F！");
  return reply;
}

function jsonResponse(statusCode, payload) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(payload),
  };
}

exports.handler = async function handler(event) {
  // CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    };
  }

  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method Not Allowed" });
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch (err) {
    return jsonResponse(400, { error: "Invalid JSON" });
  }

  const message = (body?.message || "").toString().trim();
  if (!message) {
    return jsonResponse(400, { error: "Message is required" });
  }

  try {
    const reply = await tryGeminiAPI(message);
    return jsonResponse(200, { reply });
  } catch (error) {
    console.error("Chat function error", error);
    return jsonResponse(500, { error: "鯊魚教練現在無法回應" });
  }
};
