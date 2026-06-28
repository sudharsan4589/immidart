import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

type Message = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: "welcome",
    role: "assistant",
    text: "Hi! I'm Immibro, your immigration assistant. Ask me anything about visa requirements, case status, or document checklists.",
  },
];

const CANNED_REPLIES: Record<string, string> = {
  default:
    "That's a great question! I'm currently in early access — a full response will be available soon. In the meantime, check the Visa Guide or Information Portal for guidance.",
  visa: "Visa requirements vary by destination country and visa type. Common documents include a valid passport, employer letter, proof of accommodation, and financial statements. Which country are you asking about?",
  document:
    "For most work permit applications you'll need: passport copy, signed employment contract, educational certificates, and passport-sized photos. Your case manager will confirm the exact list.",
  status:
    "You can check your case status any time in the 'All Cases' section on the dashboard, or click a specific case number for a detailed timeline.",
  sla: "SLA deadlines are set per case type and destination. Cases nearing their SLA appear under the 'Nearing SLA' tab so you can prioritise them.",
};

function getBotReply(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("visa")) return CANNED_REPLIES.visa;
  if (lower.includes("document") || lower.includes("doc")) return CANNED_REPLIES.document;
  if (lower.includes("status")) return CANNED_REPLIES.status;
  if (lower.includes("sla") || lower.includes("deadline")) return CANNED_REPLIES.sla;
  return CANNED_REPLIES.default;
}

export function AskImmibroButton() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function send() {
    const text = input.trim();
    if (!text) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: getBotReply(text),
      };
      setMessages((m) => [...m, reply]);
      setTyping(false);
    }, 900);
  }

  return (
    <>
      {/* Floating trigger */}
      <button
        type="button"
        aria-label="Ask Immibro"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 bg-brand-blue text-white px-5 py-3 rounded-full shadow-lg hover:bg-brand-blue/90 hover:shadow-xl transition-all font-medium text-sm"
      >
        <MessageCircle className="w-5 h-5" />
        Ask Immibro
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-80 sm:w-96 flex flex-col bg-white rounded-2xl shadow-2xl border border-border overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-brand-navy text-white">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-brand-blue grid place-items-center shrink-0">
                <Bot className="w-4 h-4" />
              </span>
              <div>
                <p className="text-sm font-semibold leading-none">Immibro</p>
                <p className="text-[10px] text-white/60 mt-0.5">Immigration Assistant</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="w-7 h-7 grid place-items-center rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 max-h-80 bg-brand-canvas">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex items-end gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <span
                  className={`w-6 h-6 rounded-full grid place-items-center shrink-0 ${
                    m.role === "assistant" ? "bg-brand-blue text-white" : "bg-brand-navy text-white"
                  }`}
                >
                  {m.role === "assistant" ? (
                    <Bot className="w-3.5 h-3.5" />
                  ) : (
                    <User className="w-3.5 h-3.5" />
                  )}
                </span>
                <div
                  className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm leading-snug ${
                    m.role === "assistant"
                      ? "bg-white border border-border text-foreground rounded-bl-sm"
                      : "bg-brand-blue text-white rounded-br-sm"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex items-end gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-blue text-white grid place-items-center shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </span>
                <div className="bg-white border border-border rounded-2xl rounded-bl-sm px-3 py-2 flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-brand-blue rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 bg-brand-blue rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 bg-brand-blue rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 px-3 py-2.5 border-t border-border bg-white">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about visas, documents, SLA…"
              className="flex-1 text-sm bg-transparent placeholder:text-muted-foreground focus:outline-none"
            />
            <button
              type="button"
              onClick={send}
              disabled={!input.trim()}
              aria-label="Send"
              className="w-8 h-8 grid place-items-center rounded-full bg-brand-blue text-white hover:bg-brand-blue/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
