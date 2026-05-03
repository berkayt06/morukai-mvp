// WhatsApp Cloud API integration.
// Docs: https://developers.facebook.com/docs/whatsapp/cloud-api

const GRAPH_BASE = "https://graph.facebook.com/v21.0";

export interface SendResult {
  ok: boolean;
  status: number;
  body: any;
}

export async function sendWhatsAppText(to: string, text: string): Promise<SendResult> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneId) {
    return {
      ok: false,
      status: 0,
      body: { error: "Missing WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID" },
    };
  }

  const res = await fetch(`${GRAPH_BASE}/${phoneId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: normalizePhone(to),
      type: "text",
      text: { preview_url: false, body: text },
    }),
  });

  const body = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, body };
}

export function normalizePhone(input: string): string {
  // WhatsApp expects E.164 without the leading "+" — both work in practice but
  // the API accepts plain digits. Strip whitespace and "+".
  return input.replace(/[^\d]/g, "");
}

export interface ParsedInbound {
  from: string;
  text: string;
  messageId: string;
  profileName?: string;
  timestamp?: string;
}

// Parse WhatsApp Cloud API webhook payload for the first incoming text message.
export function parseInbound(payload: any): ParsedInbound | null {
  try {
    const change = payload?.entry?.[0]?.changes?.[0];
    const value = change?.value;
    const message = value?.messages?.[0];
    if (!message) return null;
    if (message.type !== "text") {
      return {
        from: message.from,
        text: `[${message.type} message]`,
        messageId: message.id,
        profileName: value?.contacts?.[0]?.profile?.name,
        timestamp: message.timestamp,
      };
    }
    return {
      from: message.from,
      text: message.text?.body ?? "",
      messageId: message.id,
      profileName: value?.contacts?.[0]?.profile?.name,
      timestamp: message.timestamp,
    };
  } catch {
    return null;
  }
}
