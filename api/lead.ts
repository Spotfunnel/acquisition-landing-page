import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';
import { v4 as uuidv4 } from 'uuid';
import { google } from 'googleapis';
import crypto from 'crypto';

// Helper to reliably hash emails/phones for Meta CAPI
function hashData(value: string | undefined): string | undefined {
    if (!value) return undefined;
    return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const data = req.body || {};
        const {
            event_id, name, email, phone, answers, page_url,
            utm_source, utm_medium, utm_campaign, utm_content, utm_term, fbclid
        } = data;

        // 1. Validate Input
        if (!event_id || !name || !email) {
            return res.status(400).json({ error: 'Missing required configuration fields' });
        }

        // 2. KV Idempotency Check (Upstash)
        // Ensures retries or double-clicks never duplicate leads or CAPI fires
        const idempotencyKey = `lead_event:${event_id}`;
        if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
            const existing = await kv.get(idempotencyKey);
            if (existing) {
                console.log(`[Idempotency] Duplicate event skipped: ${event_id}`);
                return res.status(200).json({ ok: true, deduped: true, lead_id: (existing as any).lead_id });
            }
        }

        // 3. Generate Canonical Lead ID
        const lead_id = uuidv4();
        const created_at = new Date().toISOString();

        // 4. Append to Google Sheets directly (via Google Apps Script Webhook to bypass IAM policy)
        try {
            if (process.env.GOOGLE_APPS_SCRIPT_URL) {
                const sheetPayload = {
                    timestamp: created_at,
                    lead_id: lead_id,
                    event_id: event_id,
                    name: name,
                    email: email,
                    phone: phone,
                    industry: answers?.industry || '',
                    teamSize: answers?.teamSize || '',
                    company: answers?.company || '',
                    page_url: page_url,
                    utm_source: utm_source,
                    utm_medium: utm_medium,
                    utm_campaign: utm_campaign,
                    utm_content: utm_content,
                    utm_term: utm_term,
                    fbclid: fbclid
                };

                await fetch(process.env.GOOGLE_APPS_SCRIPT_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(sheetPayload)
                });
                console.log(`[Sheets] Row Appended successfully via Webhook (Lead ID: ${lead_id})`);
            } else {
                console.warn("[Sheets] Skipped - Missing GOOGLE_APPS_SCRIPT_URL in Vercel Env");
            }
        } catch (sheetError) {
            console.error("[Sheets Error]", sheetError);
        }

        // 5. Fire Meta CAPI Event (Server-Side Canonical Source)
        try {
            const pixelId = process.env.META_PIXEL_ID;
            const accessToken = process.env.META_ACCESS_TOKEN;

            if (pixelId && accessToken) {
                const capiPayload = {
                    data: [
                        {
                            event_name: 'Lead',
                            event_time: Math.floor(Date.now() / 1000),
                            action_source: 'website',
                            event_id: event_id,
                            event_source_url: page_url || '',
                            user_data: {
                                em: [hashData(email)],
                                ph: hashData(phone) ? [hashData(phone)] : [],
                                client_user_agent: req.headers['user-agent'] || '',
                                client_ip_address: req.headers['x-forwarded-for'] || req.socket.remoteAddress || ''
                            },
                            custom_data: {
                                lead_id: lead_id
                            }
                        }
                    ]
                };

                const capiResponse = await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(capiPayload)
                });

                if (!capiResponse.ok) {
                    const capiErr = await capiResponse.text();
                    console.error("[CAPI API Error]", capiErr);
                } else {
                    console.log(`[Meta CAPI] Server Lead Fired (Event ID: ${event_id})`);
                }
            } else {
                console.warn("[Meta CAPI] Skipped - Missing Tokens");
            }
        } catch (capiError) {
            console.error("[Meta CAPI Fatal Error]", capiError);
            // We do not fail the request if tracking fails
        }

        // 6. Write to KV Idempotency Store
        if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
            // 30 day TTL (2,592,000 seconds)
            await kv.set(idempotencyKey, { lead_id, created_at }, { ex: 2592000 });
            console.log(`[Idempotency] Record created: ${idempotencyKey}`);
        }

        // 7. Trigger internal n8n automation webhook (Best-Effort Async)
        if (process.env.N8N_WEBHOOK_URL) {
            try {
                // Fire and forget, don't await response so UI doesn't hang
                fetch(process.env.N8N_WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ lead_id, created_at, ...data }),
                }).catch(e => console.error("[n8n Async Error]", e));
                console.log("[n8n] Webhook fired");
            } catch (n8nError) {
                console.error("[n8n Fatal Error]", n8nError);
            }
        }

        // 8. Return Success to Frontend
        return res.status(200).json({ ok: true, lead_id });

    } catch (globalError) {
        console.error("[Global Vercel Error]", globalError);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
