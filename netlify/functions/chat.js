const { GoogleGenerativeAI } = require("@google/generative-ai");

const HCF_SYSTEM_PROMPT = `你現在是 HCF 新竹格鬥基地的「智能鯊魚教練兼金牌銷售」。
你的語氣：充滿能量、自信、硬派、帶點幽默。稱呼對方為「未來的戰士」或「新手」。

【HCF 資料庫】
- 地點：新竹市北區林森路301號2樓
- 特色：泰拳、踢拳、散打、肌力體能。環境無壓力，80%是新手。
- 價格：首次體驗只要 $400（團體課）。私教體驗 $1400/堂。
- 裝備：第一次來穿運動服、帶水壺毛巾即可，館內有公用拳套。

【你的任務】
1. 給出精準解答。
2. 回答必須非常簡短俐落（控制在 60 字以內，適合手機閱讀）。
3. 如果遇到不懂的問題，直接請他點擊下方「LINE 真人客服」。
4. 每一段回答的結尾，都要帶有強烈的行動呼籲 (CTA)，例如：「別猶豫了，直接點下面按鈕預約體驗！」或「來場 $400 的流汗派對吧！」。

絕對禁止：不要編造不存在的課程與價格，不要給出囉嗦的長篇大論。`;

// Determine preferred engine based on time-of-day (Taiwan timezone)
function selectEngine() {
    const hour = parseInt(new Date().toLocaleString('en-US', { timeZone: 'Asia/Taipei', hour: 'numeric', hour12: false }), 10);
    // Peak hours 18:00-20:00 Taiwan time -> prefer Gemini (faster)
    if (hour >= 18 && hour < 20) return "gemini";
    // Off-peak -> prefer Claude if available
    if (process.env.ANTHROPIC_API_KEY) return "claude";
    return "gemini";
}

async function callGemini(message) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `${HCF_SYSTEM_PROMPT}\n\n使用者的問題：「${message}」`;
    const result = await model.generateContent(prompt);
    return result.response.text();
}

async function callClaude(message) {
    const Anthropic = require("@anthropic-ai/sdk");
    const client = new Anthropic.default({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await client.messages.create({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 256,
        system: HCF_SYSTEM_PROMPT,
        messages: [{ role: "user", content: message }],
    });
    return response.content[0].text;
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
    if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

    const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

    try {
        const { message } = JSON.parse(event.body || "{}");
        if (!message) {
            return { statusCode: 400, headers, body: JSON.stringify({ reply: "請輸入問題！" }) };
        }

        const preferred = selectEngine();
        const fallback = preferred === "claude" ? "gemini" : "claude";
        const startTime = Date.now();
        let reply = null;
        let usedEngine = preferred;

        // Try preferred engine
        try {
            if (preferred === "claude") {
                reply = await callClaude(message);
            } else {
                if (!process.env.GEMINI_API_KEY) throw new Error("Missing GEMINI_API_KEY");
                reply = await callGemini(message);
            }
        } catch (primaryError) {
            console.error(`Primary engine (${preferred}) failed:`, primaryError.message);
            // Failover to the other engine
            usedEngine = fallback;
            if (fallback === "gemini" && process.env.GEMINI_API_KEY) {
                reply = await callGemini(message);
            } else if (fallback === "claude" && process.env.ANTHROPIC_API_KEY) {
                reply = await callClaude(message);
            } else {
                throw primaryError;
            }
        }

        const responseTime = Date.now() - startTime;
        await logToSupabase(usedEngine, message, responseTime, true);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ reply, engine: usedEngine }),
        };

    } catch (error) {
        console.error("AI 錯誤日誌:", error);
        await logToSupabase("error", "", 0, false);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ reply: "⚠️ 鯊魚教練去打沙包了！請直接點擊下方 LINE 找真人客服！🥊" }),
        };
    }
};
