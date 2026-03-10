import type { Context } from '@netlify/functions';

const CONTACT_EMAIL = 'hsinchucombat2022@gmail.com';

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
        };

        const { name, phone, email, message, utm_source, utm_medium, utm_campaign } = body;

        if (!name || !phone) {
            return new Response(JSON.stringify({ error: '請填寫姓名和電話' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Build email content with UTM tracking info
        const utmInfo = [
            utm_source && `來源: ${utm_source}`,
            utm_medium && `媒介: ${utm_medium}`,
            utm_campaign && `活動: ${utm_campaign}`
        ].filter(Boolean).join(' | ');

        const emailSubject = `🥊 HCF 網站新客預約通知 - ${name}`;
        const emailBody = [
            `【HCF 網站新客預約通知】`,
            ``,
            `客戶稱呼: ${name}`,
            `聯絡電話: ${phone}`,
            email ? `電子郵件: ${email}` : null,
            message ? `留言: ${message}` : null,
            ``,
            utmInfo ? `【流量來源追蹤】\n${utmInfo}` : null,
            ``,
            `提交時間: ${new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}`,
            ``,
            `請盡快聯絡此客戶安排 $400 體驗課程。`
        ].filter(Boolean).join('\n');

        // Send email via FormSubmit API (no additional API keys required)
        const formSubmitResponse = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                '標題': emailSubject,
                '客戶稱呼': name,
                '聯絡電話': phone,
                '電子郵件': email || '未提供',
                '留言': message || '無',
                '流量來源': utmInfo || '直接訪問',
                '提交時間': new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }),
                '_subject': emailSubject,
                '_template': 'table',
                '_autoresponse': email
                    ? `您好 ${name}，\n\n感謝您預約 HCF 新竹格鬥館的體驗課程！\n我們的教練將在 24 小時內與您聯繫。\n\n如有緊急問題，請加入我們的 LINE 官方帳號：https://lin.ee/7lidUv0\n\nHCF 新竹格鬥基地敬上`
                    : undefined
            })
        });

        if (!formSubmitResponse.ok) {
            throw new Error(`FormSubmit API error: ${formSubmitResponse.status}`);
        }

        return new Response(JSON.stringify({
            success: true,
            message: '郵件發送成功！教練將盡快與您聯繫。'
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });

    } catch (error) {
        console.error('Email sending error:', error);
        return new Response(JSON.stringify({
            error: '郵件發送失敗',
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
