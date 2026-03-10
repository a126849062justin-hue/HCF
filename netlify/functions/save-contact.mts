import { getStore } from '@netlify/blobs';
import type { Context } from '@netlify/functions';

export default async (req: Request, context: Context) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        });
    }

    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    try {
        const body = await req.json() as {
            name?: string;
            phone?: string;
            email?: string;
            message?: string;
            utm_source?: string;
            utm_medium?: string;
            utm_campaign?: string;
            referrer?: string;
        };

        const { name, phone, email, message, utm_source, utm_medium, utm_campaign, referrer } = body;

        if (!name || !phone) {
            return new Response(JSON.stringify({ error: '請填寫姓名和電話' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Sanitize inputs
        const sanitizedName = String(name).substring(0, 100).replace(/[<>]/g, '');
        const sanitizedPhone = String(phone).substring(0, 20).replace(/[^0-9\-\+\s\(\)]/g, '');

        // Validate phone has at least 8 digits
        if (sanitizedPhone.replace(/\D/g, '').length < 8) {
            return new Response(JSON.stringify({ error: '請填寫有效的電話號碼' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Determine traffic source category
        let trafficSource = '直接訪問';
        if (utm_source) {
            trafficSource = `${utm_source}${utm_medium ? ` / ${utm_medium}` : ''}${utm_campaign ? ` / ${utm_campaign}` : ''}`;
        } else if (referrer) {
            if (referrer.includes('google')) trafficSource = '有機搜尋 (Google)';
            else if (referrer.includes('facebook')) trafficSource = '社群媒體 (Facebook)';
            else if (referrer.includes('instagram')) trafficSource = '社群媒體 (Instagram)';
            else if (referrer.includes('line')) trafficSource = '社群媒體 (LINE)';
            else trafficSource = `外部連結: ${referrer.substring(0, 50)}`;
        }

        // Build contact record
        const contactId = `contact_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const contactRecord = {
            id: contactId,
            name: sanitizedName,
            phone: sanitizedPhone,
            email: email ? String(email).substring(0, 200) : null,
            message: message ? String(message).substring(0, 500) : null,
            utm_source: utm_source || null,
            utm_medium: utm_medium || null,
            utm_campaign: utm_campaign || null,
            traffic_source: trafficSource,
            referrer: referrer || null,
            submitted_at: new Date().toISOString(),
            submitted_at_taipei: new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }),
            ip: req.headers.get('x-forwarded-for') || context.ip || 'unknown'
        };

        // Save to Netlify Blob Storage
        const store = getStore('contacts');
        await store.setJSON(contactId, contactRecord);

        // Also maintain an index of all contact IDs for easy listing
        let contactIndex: string[] = [];
        try {
            const existingIndex = await store.get('_index', { type: 'json' }) as string[] | null;
            if (Array.isArray(existingIndex)) {
                contactIndex = existingIndex;
            }
        } catch {
            contactIndex = [];
        }
        contactIndex.push(contactId);
        // Keep only the last 1000 entries in the index
        if (contactIndex.length > 1000) {
            contactIndex = contactIndex.slice(-1000);
        }
        await store.setJSON('_index', contactIndex);

        return new Response(JSON.stringify({
            success: true,
            contact_id: contactId,
            message: '聯絡資料已儲存成功！'
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });

    } catch (error) {
        console.error('Save contact error:', error);
        return new Response(JSON.stringify({
            error: '儲存失敗',
            details: String(error)
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
};
