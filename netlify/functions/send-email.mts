import type { Context } from "@netlify/functions";

const RECIPIENT_EMAIL = "hsinchucombat2022@gmail.com";
const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`;

export default async (req: Request, context: Context) => {
    if (req.method === "OPTIONS") {
        return new Response(null, {
            status: 204,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            }
        });
    }

    if (req.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    try {
        const body = await req.json();
        const { name, phone, goal, utmSource, utmMedium, utmCampaign } = body;

        // 基本驗證
        if (!name || !phone) {
            return new Response(JSON.stringify({ error: "姓名與電話為必填欄位" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        // 防垃圾：電話格式基本檢查
        const phoneClean = String(phone).replace(/\s|-/g, "");
        if (!/^\d{8,15}$/.test(phoneClean)) {
            return new Response(JSON.stringify({ error: "電話格式不正確" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        // 組合 UTM 追蹤資訊
        const utmInfo = [
            utmSource ? `來源: ${utmSource}` : null,
            utmMedium ? `媒介: ${utmMedium}` : null,
            utmCampaign ? `活動: ${utmCampaign}` : null
        ].filter(Boolean).join(" | ");

        // 透過 FormSubmit 轉發郵件
        const emailPayload: Record<string, string> = {
            _subject: "🔥 HCF 網站新客預約通知",
            客戶稱呼: String(name).slice(0, 50),
            聯絡電話: phoneClean,
            訓練目標: goal ? String(goal).slice(0, 200) : "未填寫",
            流量來源: utmInfo || "直接流量",
            提交時間: new Date().toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })
        };

        const formsubmitRes = await fetch(FORMSUBMIT_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(emailPayload)
        });

        if (!formsubmitRes.ok) {
            const errText = await formsubmitRes.text();
            console.error("FormSubmit error:", errText);
            throw new Error("Email send failed");
        }

        return new Response(JSON.stringify({ success: true, message: "郵件已發送成功" }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });
    } catch (error) {
        console.error("send-email error:", error);
        return new Response(JSON.stringify({ error: "郵件發送失敗，請稍後再試" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
};
