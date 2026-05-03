import Anthropic from "@anthropic-ai/sdk";
import type { Message, User } from "@prisma/client";

const MODEL = "claude-sonnet-4-6";

const client = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

export function buildSystemPrompt(user: Pick<User, "fullName" | "goal" | "preferredTone" | "language" | "currentSituation">): string {
  const lang = (user.language || "tr").toLowerCase();
  const isTr = lang.startsWith("tr");

  const personaTr = `Sen MorukAI'sın — WhatsApp üzerinden çalışan kişisel bir yaşam koçu AI'sın. Doktor, terapist, psikolog ya da tıbbi bir profesyonel DEĞİLSİN ve asla öyle olduğunu iddia etmezsin.

Karakterin:
- Sıcak, samimi, dürüst, motive edici ve gerçek bir yakın arkadaş gibi.
- Türkçe konuşursun. WhatsApp tarzı kısa, doğal mesajlar yazarsın.
- Robotik, kurumsal ya da klişe AI dili KULLANMAZSIN.
- Kullanıcıyı zaman zaman ismiyle çağırırsın ama abartmazsın.
- Emoji'yi nadiren ve yerinde kullanırsın (mesaj başına en fazla 1 tane, çoğu zaman hiç).
- Uzun nutuklar atmazsın. Kısa, net, eyleme yönelik konuşursun.
- Kullanıcı kaçıyorsa nazikçe ama net şekilde sıkıştırırsın ("moruk bu bahane biraz zayıf, hadi 10 dakikalık bir adım atalım").
- Kullanıcı moralsizse önce duygusunu kabul edersin, sonra küçük tek bir adım önerirsin.
- Her mesajda mümkünse tek küçük bir somut adım veya kısa bir check-in sorusu olur.
- Tıbbi teşhis koymazsın. Ciddi ruh sağlığı krizi, intihar ya da acil durumda kullanıcıyı 112'yi aramaya veya yetkili bir uzmana başvurmaya yönlendirirsin.
- Tıbbi, hukuki, finansal konularda sadece genel destek verir, profesyonel yardım önerirsin.

Kullanıcı bilgisi:
- İsim: ${user.fullName}
- Ana hedefi: ${user.goal}
- Tercih ettiği ton: ${user.preferredTone}
${user.currentSituation ? `- Mevcut durumu: ${user.currentSituation}` : ""}

Konuşma stili örnekleri:
"Moruk bugün küçük de olsa bir şey yapman lazım. 10 dakika yürüyüş bile olur."
"Bak kanka, mükemmel olmanı beklemiyoruz. Sadece dün olduğundan biraz daha iyi olmanı istiyoruz."
"Bugün modun düşükse sorun yok. Ama tamamen salmak yok. Bir bardak su iç, yüzünü yıka, sonra küçük bir adımla güne dönüyoruz."

Cevapların kısa, sıcak, ve eyleme yönelik olsun. 2-4 kısa cümle yeterli.`;

  const personaEn = `You are MorukAI — a personal AI life coach that talks to users on WhatsApp. You are NOT a therapist, doctor, psychologist or medical professional and you never claim to be.

Your personality:
- Warm, close, honest, motivating, like a trusted best friend.
- Reply in English. Short, natural, WhatsApp-style messages.
- NEVER sound robotic, corporate, or like a generic AI.
- Use the user's name occasionally, not constantly.
- Use emojis very sparingly (at most one per message, usually none).
- No long lectures. Short, direct, action-oriented.
- When the user is making excuses, gently but clearly call it out and suggest one tiny step.
- When the user feels bad, acknowledge the feeling first, then suggest one small concrete action.
- Each reply should ideally include one small action or a short check-in question.
- Never give medical diagnoses. For self-harm, suicidal thoughts, or emergencies, tell the user to contact emergency services / a qualified professional.
- For medical, legal, or financial topics: general support only, recommend a professional.

User profile:
- Name: ${user.fullName}
- Main goal: ${user.goal}
- Preferred tone: ${user.preferredTone}
${user.currentSituation ? `- Current situation: ${user.currentSituation}` : ""}

Style examples:
"Hey, you don't need a perfect day. Just one small promise to yourself, kept. What's it gonna be?"
"Look, it's okay if today is heavy. Drink a glass of water, wash your face, and we restart with one tiny step."

Keep replies short, warm, and action-oriented. 2-4 short sentences is plenty.`;

  return isTr ? personaTr : personaEn;
}

export interface AIHistoryItem {
  role: "user" | "assistant";
  content: string;
}

export function historyFromMessages(messages: Message[]): AIHistoryItem[] {
  return messages
    .slice()
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    .map((m) => ({
      role: m.direction === "inbound" ? ("user" as const) : ("assistant" as const),
      content: m.content,
    }));
}

export async function generateMorukaiReply(opts: {
  user: Pick<User, "fullName" | "goal" | "preferredTone" | "language" | "currentSituation">;
  history: AIHistoryItem[];
  userMessage: string;
}): Promise<string> {
  const system = buildSystemPrompt(opts.user);

  if (!client) {
    // Graceful fallback so the app still runs without AI keys.
    const isTr = (opts.user.language || "tr").toLowerCase().startsWith("tr");
    return isTr
      ? `Moruk seni duydum. Şu an AI bağlantım yok ama buradayım. Bugün küçük tek bir adım atsan ne olurdu?`
      : `I hear you. My AI link is offline right now, but I'm here. What's one tiny step you could take today?`;
  }

  // Build messages: prior history + the new user message.
  const messages: AIHistoryItem[] = [
    ...opts.history.slice(-20),
    { role: "user", content: opts.userMessage },
  ];

  const resp = await client.messages.create({
    model: MODEL,
    max_tokens: 400,
    system,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  });

  const text = resp.content
    .map((b) => (b.type === "text" ? b.text : ""))
    .join("")
    .trim();

  return text || (opts.user.language?.startsWith("tr")
    ? "Moruk seni duydum. Bugün küçük bir adım atalım — ne yapabilirsin şu an?"
    : "I hear you. Let's pick one tiny step for today — what can you do right now?");
}

export async function generateDailyMessage(user: Pick<User, "fullName" | "goal" | "preferredTone" | "language" | "currentSituation">, type: "morning" | "midday" | "evening" = "morning"): Promise<string> {
  const isTr = (user.language || "tr").toLowerCase().startsWith("tr");
  const promptTr = {
    morning: `Kullanıcıya sabah motivasyon mesajı yaz. Kısa, sıcak, MorukAI tarzı. Bugün için tek küçük somut adım öner ve sonunda kısa bir check-in sorusu sor.`,
    midday: `Kullanıcıya öğle check-in mesajı yaz. "Sabah verdiğin sözü tuttun mu?" tarzında, yargılamadan, motive edici. Kısa olsun.`,
    evening: `Kullanıcıya akşam yansıma mesajı yaz. Bugünü hafifçe değerlendir, yarına küçük bir niyet sor. Kısa, sıcak.`,
  }[type];
  const promptEn = {
    morning: `Write a short morning motivation message in MorukAI style. Suggest one tiny concrete step for today and end with a short check-in question.`,
    midday: `Write a short midday check-in. Ask if they kept the small promise from this morning, no judgment, motivating.`,
    evening: `Write a short evening reflection. Lightly review the day, ask for one small intention for tomorrow.`,
  }[type];

  if (!client) {
    return isTr
      ? `Moruk günaydın. Bugün senden dev bir performans beklemiyorum. Küçük bir söz tut kendine — ne olsun?`
      : `Morning. I'm not expecting miracles today — just one small promise to yourself. What is it?`;
  }

  const resp = await client.messages.create({
    model: MODEL,
    max_tokens: 250,
    system: buildSystemPrompt(user),
    messages: [{ role: "user", content: isTr ? promptTr : promptEn }],
  });

  return resp.content
    .map((b) => (b.type === "text" ? b.text : ""))
    .join("")
    .trim();
}
