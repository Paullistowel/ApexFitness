import { useState, useRef, useEffect } from "react";
import { Send, RotateCcw, ChevronDown } from "lucide-react";
import {
  AI_NAME, AI_SUBTITLE, INITIAL_MESSAGES, SUGGESTED_PROMPTS,
  getAIResponse, AIAvatar, MessageBubble, TypingIndicator,
} from "../../components/Chat/chatShared";

// ─── Main Component ────────────────────────────────────────────────────────────
export default function ChatWithTrainer() {
  const [messages, setMessages]       = useState(INITIAL_MESSAGES);
  const [input, setInput]             = useState("");
  const [isTyping, setIsTyping]       = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const messagesEndRef = useRef(null);
  const scrollAreaRef  = useRef(null);
  const inputRef       = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Show/hide scroll-to-bottom button
  const handleScroll = () => {
    const el = scrollAreaRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBtn(distFromBottom > 200);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const send = (text = input.trim()) => {
    if (!text || isTyping) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg = { id: Date.now(), from: "user", text, time: now };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking delay (800ms–1800ms)
    const delay = 800 + Math.random() * 1000;
    setTimeout(() => {
      const aiMsg = {
        id: Date.now() + 1,
        from: "ai",
        text: getAIResponse(text),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, delay);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const clearChat = () => {
    setMessages(INITIAL_MESSAGES);
    setInput("");
    setIsTyping(false);
  };

  const showSuggestions = messages.length <= 1 && !isTyping;

  return (
    <div className="flex flex-col bg-surface" style={{ height: "calc(100vh - 56px)" }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="bg-elevated border-b border-border/10 px-4 sm:px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <AIAvatar size="md" />
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-black text-foreground">{AI_NAME}</p>
              <span className="flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                Online
              </span>
            </div>
            <p className="text-xs text-muted mt-0.5">{AI_SUBTITLE}</p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-red-400 bg-overlay/5 hover:bg-red-500/10 border border-border/10 hover:border-red-500/20 px-3 py-1.5 rounded-xl transition-all"
        >
          <RotateCcw size={12} />
          New Chat
        </button>
      </div>

      {/* ── Messages area ────────────────────────────────────────────────── */}
      <div
        ref={scrollAreaRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-5 relative"
      >
        {/* Max-width container */}
        <div className="max-w-3xl mx-auto space-y-5">

          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}

          {isTyping && <TypingIndicator />}

          {/* Suggested prompts — shown only on fresh chat */}
          {showSuggestions && (
            <div className="space-y-3 pt-2">
              <p className="text-xs text-muted font-semibold text-center">Suggested questions</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SUGGESTED_PROMPTS.map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    onClick={() => send(label)}
                    className="flex items-center gap-3 text-left px-4 py-3 bg-overlay/5 hover:bg-overlay/10 border border-border/10 hover:border-primary/30 rounded-2xl transition-all group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center shrink-0 transition-colors">
                      <Icon size={14} className="text-primary" />
                    </div>
                    <span className="text-xs font-semibold text-foreground/80 group-hover:text-foreground transition-colors">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Scroll to bottom button */}
      {showScrollBtn && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-24 right-6 w-9 h-9 rounded-full bg-elevated border border-border/10 flex items-center justify-center shadow-lg hover:bg-overlay/10 transition-colors z-10"
          style={{ position: "fixed", bottom: "90px", right: "24px" }}
        >
          <ChevronDown size={16} className="text-muted" />
        </button>
      )}

      {/* ── Input bar ────────────────────────────────────────────────────── */}
      <div className="bg-elevated border-t border-border/10 px-4 sm:px-6 py-4 shrink-0">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about fitness, nutrition or workouts…"
                className="w-full resize-none bg-overlay/5 border border-border/10 focus:border-primary/30 text-foreground placeholder-gray-600 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all max-h-36 overflow-y-auto"
                style={{ lineHeight: "1.5" }}
              />
            </div>
            <button
              onClick={() => send()}
              disabled={!input.trim() || isTyping}
              className="w-11 h-11 rounded-full bg-primary hover:bg-primary disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-md shadow-primary/30 shrink-0"
            >
              <Send size={16} className="text-foreground ml-0.5" />
            </button>
          </div>
          <p className="text-[10px] text-subtle text-center mt-2">
            Apex AI Coach can make mistakes. Always consult a professional for medical advice.
          </p>
        </div>
      </div>

      <style>{`@keyframes typingBounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}`}</style>
    </div>
  );
}
