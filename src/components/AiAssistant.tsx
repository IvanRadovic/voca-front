import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useAiChat } from "../hooks/mutations";

interface Msg {
  role: "user" | "assistant";
  text: string;
  matches?: { id: number; title: string }[];
}

// Floating chat assistant for authenticated youth users.
export default function AiAssistant() {
  const { t, lang } = useLanguage();
  const { isAuthenticated, isYouth } = useAuth();
  const chat = useAiChat();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chat.isPending]);

  if (!isAuthenticated || !isYouth) return null;

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const message = input.trim();
    if (!message || chat.isPending) return;
    setMessages((m) => [...m, { role: "user", text: message }]);
    setInput("");
    chat.mutate(
      { message, lang },
      {
        onSuccess: (res) =>
          setMessages((m) => [...m, { role: "assistant", text: res.text, matches: res.matches }]),
        onError: () => setMessages((m) => [...m, { role: "assistant", text: "⚠️" }]),
      },
    );
  };

  return (
    <>
      {/* Launcher */}
      {open ? (
        <button
          onClick={() => setOpen(false)}
          className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-2xl text-white shadow-lg transition hover:bg-brand-700"
          aria-label={t("ai.close")}
        >
          ×
        </button>
      ) : (
        <button
          onClick={() => setOpen(true)}
          aria-label={t("ai.title")}
          className="group fixed bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-full bg-gradient-to-br from-brand-600 via-brand-500 to-sky-500 bg-gradient-animated animate-gradient py-3 pl-3 pr-5 font-semibold text-white shadow-xl shadow-brand-600/40 ring-1 ring-white/30 transition hover:-translate-y-0.5 hover:shadow-brand-600/60"
        >
          {/* attention pulse */}
          <span className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-brand-500 opacity-60 animate-ping" />
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-lg backdrop-blur transition group-hover:rotate-12">
            ✨
          </span>
          <span className="text-sm">{t("ai.launcher")}</span>
        </button>
      )}

      {open && (
        <div className="fixed bottom-24 right-5 z-40 flex h-[28rem] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl animate-scale-in dark:border-gray-700 dark:bg-gray-900">
          <div className="bg-brand-600 px-4 py-3 font-semibold text-white">✨ {t("ai.title")}</div>

          <div className="flex-1 space-y-3 overflow-y-auto p-3 text-sm">
            <div className="rounded-lg bg-gray-100 p-2 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              {t("ai.greeting")}
            </div>
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-right" : ""}>
                <div
                  className={`inline-block max-w-[85%] whitespace-pre-wrap rounded-lg p-2 ${
                    m.role === "user"
                      ? "bg-brand-600 text-white"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                  }`}
                >
                  {m.text}
                </div>
                {m.matches && m.matches.length > 0 && (
                  <div className="mt-1 space-y-1">
                    {m.matches.map((mt) => (
                      <Link
                        key={mt.id}
                        to={`/calls/${mt.id}`}
                        onClick={() => setOpen(false)}
                        className="block rounded-lg border border-gray-200 p-2 text-left text-xs font-medium text-brand-600 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                      >
                        → {mt.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {chat.isPending && <div className="text-xs text-gray-400">{t("ai.thinking")}</div>}
            <div ref={endRef} />
          </div>

          <form onSubmit={send} className="flex gap-2 border-t border-gray-100 p-2 dark:border-gray-800">
            <input
              className="input"
              placeholder={t("ai.placeholder")}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" disabled={chat.isPending} className="btn-primary shrink-0">
              {t("ai.send")}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
