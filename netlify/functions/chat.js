const { GoogleGenerativeAI } = require("@google/generative-ai");

// FAQ quick-match database — returns instant answers without calling Gemini API
const faqDatabase = [
    { keywords: ['第一次', '初次', '帶什麼', '需要帶', '要帶'],       answer: '第一次來只要帶運動服、毛巾、水壺就好！館內有公用拳套，裝備全包，輕裝出發就對了！立即預約體驗只要 $400 🥊' },
    { keywords: ['費用', '價格', '多少錢', '收費', '學費'],           answer: '費用清單：✅ 首次體驗（團體課）$400 ✅ 月卡 $3,000 ✅ 私人教練 $1,400/堂。別猶豫，$400 就能直接體驗！' },
    { keywords: ['新手', '初學者', '零基礎', '沒學過', '第一次打'],   answer: '放心！80% 的學員都是新手開始的，教練會根據你的程度調整，完全無壓力。來場 $400 的流汗派對吧！' },
    { keywords: ['時間', '上課時間', '幾點', '營業時間', '開放'],     answer: '上課時間：平日 18:00–21:00，週末 09:00–18:00。時間彈性，找個你方便的時段來體驗吧！' },
    { keywords: ['地點', '地址', '位置', '哪裡', '怎麼去', '停車'],   answer: '基地在新竹市北區林森路 301 號 2 樓，備有停車位，交通超方便！導航直接搜尋「HCF Hsinchu Combat」就到了 📍' },
    { keywords: ['女生', '女性', '女孩', '適合女', '女生可以'],       answer: '超級歡迎！我們的助教小米就是女性，從 27 歲才開始接觸泰拳，最終拿下冠軍！現在很多女學員都在這裡成長 💪' },
    { keywords: ['小米', '助教小米', '女教練'],                        answer: '助教小米是我們的明星教練！她 27 歲才開始打泰拳，曾經因憂鬱症住院，泰拳改變了她的人生。桃園市長盃女子 48kg 冠軍！她最擅長近身戰、重拳重腿，指名她的課超受歡迎！' },
    { keywords: ['裝備', '服裝', '穿什麼', '拳套', '護具'],           answer: '第一堂穿運動服就可以！拳套、護具館內都有公用的。之後喜歡的話可以買泰拳短褲，先來體驗最重要 👊' },
    { keywords: ['試課', '體驗課', '試試', '先試'],                   answer: '有！首堂體驗課只要 $400，包含完整教練指導。這是你人生最值得的 $400！點下方按鈕直接預約！' },
    { keywords: ['私教', '私人教練', '一對一', '個人課'],             answer: '私人教練一堂 $1,400，教練 100% 專注在你身上，量身打造訓練計劃。比一杯珍奶系列還划算！預約體驗吧！' },
    { keywords: ['泰拳', '踢拳', '散打', '課程', '項目', '什麼課'],   answer: 'HCF 主打泰拳、踢拳、散打、MMA，還有重訓體能課！不管你想強身、減重還是上擂台，這裡都有適合你的課！' },
    { keywords: ['安全', '危險', '受傷', '打架'],                     answer: '別擔心！課程設計完善，有護具保護。新手課著重技術而非對打，安全第一。教練會確保每個人的訓練安全 🛡️' },
];

function matchFAQ(message) {
    if (!message) return null;
    const lowerMsg = message.toLowerCase();
    for (const faq of faqDatabase) {
        if (faq.keywords.some(kw => lowerMsg.includes(kw))) {
            return faq.answer;
        }
    }
    return null;
}

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("Missing API Key");
        }

        const { message } = JSON.parse(event.body);

        // Try FAQ quick-match first (zero API cost)
        const faqAnswer = matchFAQ(message);
        if (faqAnswer) {
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reply: faqAnswer })
            };
        }

        // Fall back to Gemini API for questions not in FAQ
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const systemPrompt = `
            你現在是 HCF 新竹格鬥基地的「智能鯊魚教練兼金牌銷售」。
            你的語氣：充滿能量、自信、硬派、帶點幽默。稱呼對方為「未來的戰士」或「新手」。
            
            【HCF 資料庫】
            - 地點：新竹市北區林森路301號2樓（備停車位）
            - 特色：泰拳、踢拳、散打、肌力體能。環境無壓力，80%是新手。
            - 價格：首次體驗只要 $400（團體課）。私教體驗 $1400/堂。月卡 $3000。
            - 裝備：第一次來穿運動服、帶水壺毛巾即可，館內有公用拳套。
            - 上課時間：平日 18:00-21:00，週末 09:00-18:00
            - 助教小米：女性助教，27歲才開始打泰拳，桃園市長盃女子48kg冠軍，擅長近身戰、重拳重腿。
            
            【你的任務】
            1. 根據使用者的問題：「${message}」，給出精準解答。
            2. 回答必須非常簡短俐落（控制在 60 字以內，適合手機閱讀）。
            3. 如果遇到不懂的問題，直接請他點擊下方「LINE 真人客服」。
            4. 每一段回答的結尾，都要帶有強烈的行動呼籲 (CTA)，例如：「別猶豫了，直接點下面按鈕預約體驗！」或「來場 $400 的流汗派對吧！」。
            
            絕對禁止：不要編造不存在的課程與價格，不要給出囉嗦的長篇大論。
        `;

        const result = await model.generateContent(systemPrompt);
        const responseText = result.response.text();

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reply: responseText })
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
