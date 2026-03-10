import { getStore } from "@netlify/blobs";
import type { Context } from "@netlify/functions";

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

        if (!name || !phone) {
            return new Response(JSON.stringify({ error: "姓名與電話為必填欄位" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        const phoneClean = String(phone).replace(/\s|-/g, "");
        if (!/^\d{8,15}$/.test(phoneClean)) {
            return new Response(JSON.stringify({ error: "電話格式不正確" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        const store = getStore("contacts");

        // 用時間戳產生唯一 key（避免覆蓋）
        const key = `contact-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

        const record = {
            name: String(name).slice(0, 50),
            phone: phoneClean,
            goal: goal ? String(goal).slice(0, 200) : "",
            utmSource: utmSource || "direct",
            utmMedium: utmMedium || "none",
            utmCampaign: utmCampaign || "none",
            submittedAt: new Date().toISOString()
        };

        await store.set(key, JSON.stringify(record));

        console.log(JSON.stringify({ event: "contact_saved", key, utmSource, utmMedium, utmCampaign }));

        return new Response(JSON.stringify({ success: true, key }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });
    } catch (error) {
        console.error("save-contact error:", error);
        return new Response(JSON.stringify({ error: "儲存失敗，請稍後再試" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
};
