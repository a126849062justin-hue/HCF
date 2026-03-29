const Anthropic = require("@anthropic-ai/sdk");

let GoogleGenerativeAI = null;
async function getGoogleGenerativeAI() {
    if (GoogleGenerativeAI) return GoogleGenerativeAI;
    const mod = await import("@google/generative-ai");
    GoogleGenerativeAI = mod.GoogleGenerativeAI || mod.default;
    return GoogleGenerativeAI;
}

const { HCF_SYSTEM_PROMPT } = require("./shared-config");

async function tryClaudeAPI(message) {
    if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error("ANTHROPIC_API_KEY not configured");
    }
    console.log("📌 嘗試 Claude API...");
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await client.messages.create({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 256,
        system: HCF_SYSTEM_PROMPT,
        messages: [{ role: "user", content: message }],
    });
    const reply = response.content[0].text;
    console.log("✅ Claude 成功！");
    return { reply, engine: "claude" };
}

async function tryGeminiAPI(message) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY not configured");
    }
    console.log("📌 嘗試 Gemini API...");
    const GoogleGenerativeAI = await getGoogleGenerativeAI();
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `${HCF_SYSTEM_PROMPT}\n\n使用者的問題：「${message}」`;
    const result = await model.generateContent(prompt);
    const reply = result.response.text();
    console.log("✅ Gemini 成功！");
    return { reply, engine: "gemini" };
}

async function logToSupabase(engine, message, responseTime, success) {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) return;
    try {
        const { createClient } = require("@supabase/supabase-js");
        const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
        await supabase.from("ai_interactions").insert({
            engine,
            user_message: message,
            response_time: responseTime,
            success,
        });
    } catch (err) {
        console.error("Supabase log error:", err.message);
    }
}

exports.handler = async (event) => {
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization"
            },
            body: ""
        };
    }

    if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

    const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

    try {
        const { message } = JSON.parse(event.body || "{}");
        if (!message) {
            return { statusCode: 400, headers, body: JSON.stringify({ reply: "請輸入問題！" }) };
        }

        const startTime = Date.now();

        // Try Claude first (higher quality)
        try {
            const result = await tryClaudeAPI(message);
            const responseTime = Date.now() - startTime;
            await logToSupabase(result.engine, message, responseTime, true);
            return { statusCode: 200, headers, body: JSON.stringify(result) };
        } catch (claudeError) {
            console.error("❌ Claude 失敗，轉移到 Gemini:", claudeError.message);
        }

        // Fallback to Gemini
        try {
            const result = await tryGeminiAPI(message);
            const responseTime = Date.now() - startTime;
            await logToSupabase(result.engine, message, responseTime, true);
            return { statusCode: 200, headers, body: JSON.stringify(result) };
        } catch (geminiError) {
            console.error("❌ Gemini 也失敗了:", geminiError.message);
            throw geminiError;
        }

    } catch (error) {
        console.error("🔴 AI 錯誤日誌:", error);
        await logToSupabase("error", "", 0, false);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                reply: "⚠️ 鯊魚教練現在無法回應。請直接點擊下方 LINE 找真人客服！🥊",
                engine: "error",
            }),
        };
    }
};
