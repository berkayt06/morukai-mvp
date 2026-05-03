interface Bubble {
  from: "morukai" | "user";
  text: string;
}

const DEFAULT_BUBBLES: Bubble[] = [
  { from: "morukai", text: "Moruk günaydın. Bugün dev bir performans beklemiyorum, sadece kendine verdiğin sözü tut. Ne olsun?" },
  { from: "user", text: "Sabah 20 dk yürüyüş yapacağım." },
  { from: "morukai", text: "İşte bu. Ayakkabını şimdi kapının önüne koy, yarım iş bitti." },
  { from: "user", text: "Yaptım moruk." },
  { from: "morukai", text: "Helal sana. Akşam tekrar konuşalım, bugünü değerlendirelim 👊" },
];

export default function PhoneMockup({ bubbles = DEFAULT_BUBBLES }: { bubbles?: Bubble[] }) {
  return (
    <div className="tilt-card relative mx-auto w-[320px]">
      <div className="relative rounded-[2.5rem] bg-slate-900 p-3 shadow-glow ring-1 ring-black/10">
        <div className="rounded-[2rem] bg-[#e5ddd5] overflow-hidden">
          <div className="bg-emerald-700 text-white px-4 py-3 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-white/20 grid place-items-center text-lg font-bold">M</div>
            <div>
              <div className="font-semibold leading-tight">MorukAI</div>
              <div className="text-[11px] opacity-80">çevrimiçi</div>
            </div>
          </div>
          <div className="p-3 space-y-2 h-[460px] overflow-hidden bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22><circle cx=%221%22 cy=%221%22 r=%221%22 fill=%22%23d6cfc4%22/></svg>')]">
            {bubbles.map((b, i) => (
              <div key={i} className={`flex ${b.from === "morukai" ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow ${
                  b.from === "morukai"
                    ? "bg-white text-slate-900 rounded-bl-sm"
                    : "bg-emerald-100 text-slate-900 rounded-br-sm"
                }`}>
                  {b.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-br from-emerald-300/40 to-lime-300/40 blur-2xl" />
    </div>
  );
}
