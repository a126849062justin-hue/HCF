const { GoogleGenerativeAI } = require("@google/generative-ai");

// ============================================================
// HCF 新手常見問答知識庫 (FAQ Knowledge Base)
// ============================================================
const FAQ_DATABASE = [
    {
        keywords: ["費用", "價格", "多少錢", "收費", "cost", "price", "體驗"],
        answer: "💰 費用超划算！團體課首次體驗只要 $400（原價 $600）！私人教練體驗 $1,400/堂，或 2 堂合購 $2,400。無限包月團課 $5,500/月。別猶豫，直接點下方按鈕預約 $400 體驗！"
    },    {
        keywords: ["新手", "初學者", "沒學過", "第一次", "beginner", "適合"],
        answer: "🔰 超適合新手！館內 80% 都是新手，氣氛輕鬆無壓力。教練會從零帶你，不需要任何格鬥基礎。你只需要帶顆想改變的心來就好！立即預約 $400 體驗課！"
    },
    {
        keywords: ["地點", "在哪", "地址", "怎麼去", "location", "address", "交通"],
        answer: "📍 基地座標：新竹市北區林森路301號2樓。距離火車站超近！可搭公車或騎車前往，附近有收費停車場。Google 地圖搜尋「HCF新竹格鬥館」即可導航！"
    },
    {
        keywords: ["裝備", "拳套", "穿什麼", "帶什麼", "equipment", "gear", "準備"],
        answer: "🥊 第一次超簡單！穿舒適運動服（短褲或彈性褲），帶水壺和毛巾就好。館內有公用拳套可借用，赤腳訓練不需要運動鞋！衛生考量可在櫃台購買專屬拳套。"
    },
    {
        keywords: ["課表", "時間", "上課時間", "幾點", "schedule", "時段"],
        answer: "⏰ 課表超豐富！週一至週五 11:00-22:00，週六週日 11:00-16:00。詳細課表請看頁面上方「最新課表」區塊，或加入官方 LINE 取得最新課表！"
    },
    {
        keywords: ["泰拳", "muay thai", "踢拳", "kickboxing", "散打", "sanda", "肌力", "課程種類"],
        answer: "🏆 HCF 主打 4 大課程：泰拳（八肢藝術）、踢拳（速度律動）、散打（技術博弈）、肌力體能（功能性訓練）。每種都超有趣！先來 $400 團課體驗，找到最愛的那個！"
    },
    {
        keywords: ["教練", "instructor", "coach", "老師", "誰"],
        answer: "👊 教練陣容超強！總教練黃謙和（42勝職業戰績/WBC冠軍），加上 Allen（竹科戰神）、鄭豫（功夫熊貓）、高大可（一年減30KG）、胡脩誠等金牌教練。都是真正上過擂台的實戰高手！"
    },
    {
        keywords: ["女生", "女性", "女孩", "girl", "female", "女"],
        answer: "💪 女生超歡迎！HCF 有很多女生學員。格鬥運動是最有效的全身塑形運動，能燃脂、練線條、提升自信和防身能力。而且教練超有耐心，絕對不會讓你不舒服！"
    },
    {
        keywords: ["減肥", "減脂", "瘦身", "減重", "燃脂", "身材", "體型"],
        answer: "🔥 格鬥是最強燃脂運動！單堂泰拳可燃燒 600-800 卡路里。學員高大可一年內從 104kg 減到 74kg，親身證明！來 $400 體驗，感受什麼叫「流汗的快感」！"
    },
    {
        keywords: ["私人", "一對一", "private", "個人教練", "專屬"],
        answer: "⭐ 私人教練是最強選擇！60分鐘一對一，教練 100% 專注在你身上，量身打造專屬菜單。體驗價 $1,400/堂 或 2堂 $2,400。想快速看到成效？直接選私教！"
    },
    {
        keywords: ["聯絡", "電話", "line", "預約", "contact", "fb", "ig", "instagram", "facebook", "youtube"],
        answer: "📱 多管道聯絡！LINE 官方諮詢：https://lin.ee/7lidUv0、IG：@hc.combat2022、FB：hsinchucombat、電話：0925-571-225、Email：hsinchucombat2022@gmail.com。最快！直接點下方 LINE 按鈕！"
    },
    {
        keywords: ["停車", "parking", "公車", "捷運", "停車場"],
        answer: "🚗 交通超方便！附近有多個收費停車場，也可騎機車或搭公車。地址：新竹市北區林森路301號2樓。有任何問題加入 LINE 詢問！"
    },
    {
        keywords: ["健身", "運動", "鍛鍊", "fitness", "workout", "訓練"],
        answer: "💥 HCF 不只是格鬥館，更是最硬派的健身中心！結合格鬥技巧與功能性體能訓練，讓你不只練出線條，還學會真正的防身技術。來 $400 體驗，感受不同凡響的訓練！"
    },
    {
        keywords: ["比賽", "競技", "擂台", "champion", "competition"],
        answer: "🏅 有志參賽的戰士，我們的教練就是現役職業選手！從基礎到參賽全程指導。但不想比賽只想健身、減肥、防身也完全 OK！HCF 歡迎所有等級的學員！"
    },
    {
        keywords: ["防身", "self defense", "保護", "安全"],
        answer: "🛡️ 格鬥就是最好的防身術！泰拳、散打的實戰技術，能在關鍵時刻保護自己和家人。更重要的是訓練帶來的自信，讓你在任何場合都能從容應對！"
    }
];

/**
 * Pre-lowercase all keywords at module load time to avoid repeated toLowerCase() calls
 * during each request.
 */
const FAQ_INDEX = FAQ_DATABASE.map(faq => ({
    keywords: faq.keywords.map(kw => kw.toLowerCase()),
    answer: faq.answer
}));

/**
 * Try to find a FAQ match for the user's message.
 * Returns a pre-defined answer if found, or null if not.
 */
function findFaqAnswer(message) {
    const normalizedMsg = message.toLowerCase();
    for (const faq of FAQ_INDEX) {
        if (faq.keywords.some(kw => normalizedMsg.includes(kw))) {
            return faq.answer;
        }
    }
    return null;
}

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

    try {
        const { message } = JSON.parse(event.body);

        if (!message || message.trim() === "") {
            return {
                statusCode: 400,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reply: "請問你想了解什麼？可以問我費用、地點、課程或裝備等問題！" })
            };
        }

        // 1. First try FAQ knowledge base (fast, no API cost)
        const faqAnswer = findFaqAnswer(message);
        if (faqAnswer) {
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reply: faqAnswer, source: "faq" })
            };
        }

        // 2. Fall back to Gemini AI for questions not covered by FAQ
        if (!process.env.GEMINI_API_KEY) {
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reply: "這個問題超棒！請點擊下方「LINE 真人客服」，讓我們的教練直接為你解答！🥊" })
            };
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const systemPrompt = `
            你現在是 HCF 新竹格鬥基地的「智能鯊魚教練兼金牌銷售」。
            你的語氣：充滿能量、自信、硬派、帶點幽默。稱呼對方為「未來的戰士」或「新手」。
            
            【HCF 完整資料庫】
            - 地點：新竹市北區林森路301號2樓（近新竹火車站）
            - 特色：泰拳、踢拳、散打、肌力體能。環境無壓力，80%是新手。
            - 營業時間：週一至週五 11:00-22:00，週六週日 11:00-16:00
            - 聯絡電話：0925-571-225
            - Email：hsinchucombat2022@gmail.com
            - LINE：https://lin.ee/7lidUv0
            
            【價格資訊】
            - 團體課首次體驗：$400（原價 $600）
            - 私人教練體驗（1堂）：$1,400
            - 私人教練體驗（2堂）：$2,400
            - 團體課單堂：$600
            - 團體課10堂/60天：$4,500
            - 團體課30堂/150天：$10,500
            - 無限包月：$5,500/月
            - 私人教練單堂：$2,200
            - 私人教練10堂/90天：$18,000
            - 私人教練20堂/120天：$34,000
            - 私人教練30堂/180天：$48,000
            
            【教練團隊】
            - 黃謙和（總教練）：42勝12負職業戰績，WBC冠軍，MAX FC越南站冠軍
            - Allen（竹科戰神）：踢拳專家，竹科工程師轉型教練
            - 鄭豫（功夫熊貓）：散打/詠春，世界南少林詠春大賽冠軍
            - 高大可（大杯可樂）：泰拳，一年減30KG（104kg→74kg）
            - 胡脩誠（臨火無懼）：自由搏擊/踢拳，Rise Nova冠軍
            
            【你的任務】
            1. 根據使用者的問題：「${message}」，給出精準解答。
            2. 回答必須非常簡短俐落（控制在 80 字以內，適合手機閱讀）。
            3. 如果遇到不懂的問題，直接請他點擊下方「LINE 真人客服」。
            4. 每一段回答的結尾，都要帶有強烈的行動呼籲 (CTA)。
            
            絕對禁止：不要編造不存在的課程與價格，不要給出囉嗦的長篇大論。
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
