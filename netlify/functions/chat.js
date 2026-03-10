const { GoogleGenerativeAI } = require("@google/generative-ai");

// ── 新手常見問答知識庫 ────────────────────────────────────────────────────────
const FAQ_DB = [
    {
        keywords: ["費用", "價格", "多少錢", "收費", "cost", "price", "多少", "怎麼算"],
        answer: "💰 首次體驗 $400（團體課），私教體驗 $1,400/堂。月費方案最低每月 $2,500 起！別猶豫，$400 先體驗再說！"
    },
    {
        keywords: ["新手", "初學者", "沒基礎", "零基礎", "beginner", "第一次", "適合嗎", "適合"],
        answer: "🔰 完全適合！館內 80% 都是新手，教練會從基礎帶起，沒有壓力。現在就預約 $400 體驗，感受一下！"
    },
    {
        keywords: ["地點", "在哪", "地址", "位置", "怎麼去", "交通", "location", "address"],
        answer: "📍 新竹市北區林森路301號2樓。鄰近新竹車站，捷運/公車皆可到達。點下方按鈕導航！"
    },
    {
        keywords: ["裝備", "需要帶", "穿什麼", "拳套", "護具", "equipment", "gear"],
        answer: "🥊 第一次來只需穿運動服、帶水壺和毛巾！館內有公用拳套，不需要自備任何裝備。超友善！"
    },
    {
        keywords: ["課程", "泰拳", "踢拳", "散打", "重訓", "肌力", "class", "program"],
        answer: "🥋 開課項目：泰拳、踢拳、散打、肌力體能。團體課 $400 起，私教課 $1,400 起。填表預約體驗！"
    },
    {
        keywords: ["時間", "營業", "上課時間", "幾點", "schedule", "hours", "開放"],
        answer: "⏰ 週一～週五 11:00-22:00，週六日 11:00-16:00。每天都有多個時段可選。預約填表即可！"
    },
    {
        keywords: ["私人", "私教", "一對一", "personal", "private", "1對1"],
        answer: "⭐ 私人教練體驗 $1,400/堂，專屬訓練計畫＋全程陪伴指導。效果超快！立即預約！"
    },
    {
        keywords: ["月費", "月卡", "會員", "membership", "monthly"],
        answer: "📅 月費方案：團體課無限堂 $2,500起。加入會員訓練更有效率！填表了解最新方案！"
    },
    {
        keywords: ["減肥", "減重", "瘦", "健身", "塑身", "weight", "lose", "fit"],
        answer: "🔥 格鬥訓練是最有效的燃脂方式！每堂可消耗 600-800 大卡。來 $400 體驗，親身感受！"
    },
    {
        keywords: ["停車", "parking", "捷運", "交通", "公車"],
        answer: "🚗 附近有多個收費停車場，步行3分鐘可到。公車也很方便！有問題請直接 LINE 詢問！"
    },
    {
        keywords: ["女生", "女性", "女", "female", "women", "girl"],
        answer: "👩 非常歡迎女生！很多女學員跟著練，環境安全友善，教練都超溫柔有耐心。來試試 $400 體驗！"
    },
    {
        keywords: ["兒童", "小孩", "青少年", "kid", "child", "youth"],
        answer: "👦 有開設青少年課程！歡迎詢問適合的年齡班別。請點 LINE 客服了解詳情！"
    }
];

// ── 智能問答分類匹配 ─────────────────────────────────────────────────────────
function matchFAQ(message) {
    if (!message) return null;
    const lowerMsg = message.toLowerCase();
    for (const faq of FAQ_DB) {
        if (faq.keywords.some(kw => lowerMsg.includes(kw))) {
            return faq.answer;
        }
    }
    return null;
}

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

    try {
        const { message, source } = JSON.parse(event.body || "{}");

        // 記錄查詢行為（用於分析）
        console.log(JSON.stringify({ event: "ai_query", message, source, timestamp: new Date().toISOString() }));

        // 優先使用 FAQ 知識庫快速回覆（節省 API 額度）
        const faqAnswer = matchFAQ(message);
        if (faqAnswer) {
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reply: faqAnswer, source: "faq" })
            };
        }

        // FAQ 未命中 → 呼叫 Gemini AI
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("Missing API Key");
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const systemPrompt = `
你現在是 HCF 新竹格鬥基地的「智能鯊魚教練兼金牌銷售」。
你的語氣：充滿能量、自信、硬派、帶點幽默。稱呼對方為「未來的戰士」或「新手」。

【HCF 資料庫】
- 地點：新竹市北區林森路301號2樓
- 特色：泰拳、踢拳、散打、肌力體能。環境無壓力，80%是新手。
- 價格：首次體驗 $400（團體課）。私教體驗 $1,400/堂。月費 $2,500起。
- 裝備：第一次來穿運動服、帶水壺毛巾即可，館內有公用拳套。
- 營業時間：週一～週五 11:00-22:00，週六日 11:00-16:00
- 聯絡：hsinchucombat2022@gmail.com | LINE: https://lin.ee/7lidUv0

【新手常見問答】
Q: 費用？A: 團體體驗 $400，私教 $1,400/堂，月費 $2,500起
Q: 適合新手嗎？A: 完全適合，80%學員都是新手
Q: 需要裝備？A: 第一次只需運動服+水壺，館有公用拳套
Q: 上課時間？A: 週一五11-22點，週六日11-16點

【你的任務】
1. 根據使用者的問題：「${message}」，給出精準解答
2. 回答控制在 60 字以內，適合手機閱讀
3. 如果不確定，請他點「LINE 真人客服」
4. 結尾加強烈的行動呼籲 (CTA)

絕對禁止：不要編造不存在的課程與價格。
        `;

        const result = await model.generateContent(systemPrompt);
        const responseText = result.response.text();

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reply: responseText, source: "ai" })
        };

    } catch (error) {
        console.error("AI 錯誤日誌:", error);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reply: "⚠️ 鯊魚教練去打沙包了！請直接點擊下方 LINE 找真人客服！🥊" })
        };
    }
};
