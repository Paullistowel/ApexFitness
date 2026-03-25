import { useState, useRef, useEffect } from "react";
import { Send, X, Minimize2, RotateCcw, ChevronDown, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AI_NAME, INITIAL_MESSAGES, SUGGESTED_PROMPTS,
  getAIResponse, AIAvatar, MessageBubble, TypingIndicator,
} from "./chatShared";

export default function ChatWidget() {
  const [open,      setOpen]      = useState(false);
  const [messages,  setMessages]  = useState(INITIAL_MESSAGES);
  const [input,     setInput]     = useState("");
  const [isTyping,  setIsTyping]  = useState(false);
  const [showScroll, setShowScroll] = useState(false);

  const messagesEndRef = useRef(null);
  const scrollRef      = useRef(null);
  const inputRef       = useRef(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, open]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowScroll(el.scrollHeight - el.scrollTop - el.clientHeight > 150);
  };

  const send = (text = input.trim()) => {
    if (!text || isTyping) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages((p) => [...p, { id: Date.now(), from: "user", text, time: now }]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      setMessages((p) => [...p, {
        id: Date.now() + 1, from: "ai",
        text: getAIResponse(text),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
      setIsTyping(false);
    }, 800 + Math.random() * 800);
  };

  const showSuggestions = messages.length <= 1 && !isTyping;

  return (
    <>
      {/* ── Floating panel ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed bottom-20 right-5 z-50 w-[360px] sm:w-[400px] flex flex-col bg-elevated border border-border/10 rounded-3xl shadow-2xl shadow-black/50 overflow-hidden"
            style={{ height: "520px" }}
          >
            {/* Header */}
            <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border/10 shrink-0 bg-elevated">
              <AIAvatar size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-black text-foreground">{AI_NAME}</p>
                  <span className="flex items-center gap-1 text-[9px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 rounded-full">
                    <span className="w-1 h-1 rounded-full bg-green-400 inline-block" /> Online
                  </span>
                </div>
              </div>
              <button onClick={() => setMessages(INITIAL_MESSAGES)}
                title="New chat"
                className="w-7 h-7 rounded-full hover:bg-overlay/10 flex items-center justify-center transition-colors text-muted hover:text-red-400">
                <RotateCcw size={12} />
              </button>
              <button onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-full hover:bg-overlay/10 flex items-center justify-center transition-colors">
                <Minimize2 size={13} className="text-muted" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} onScroll={handleScroll}
              className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
              {messages.map((msg) => <MessageBubble key={msg.id} msg={msg} />)}
              {isTyping && <TypingIndicator />}

              {showSuggestions && (
                <div className="space-y-2 pt-1">
                  <p className="text-[10px] text-muted font-semibold text-center">Suggested</p>
                  <div className="grid grid-cols-1 gap-1.5">
                    {SUGGESTED_PROMPTS.slice(0, 4).map(({ icon: Icon, label }) => (
                      <button key={label} onClick={() => send(label)}
                        className="flex items-center gap-2.5 text-left px-3 py-2 bg-overlay/5 hover:bg-overlay/10 border border-border/10 hover:border-primary/30 rounded-xl transition-all group text-xs">
                        <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Icon size={11} className="text-primary" />
                        </div>
                        <span className="font-semibold text-foreground/80 group-hover:text-foreground transition-colors">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Scroll to bottom */}
            {showScroll && (
              <button onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })}
                className="absolute bottom-16 right-4 w-7 h-7 rounded-full bg-elevated border border-border/10 flex items-center justify-center shadow-md hover:bg-overlay/10 transition-colors z-10">
                <ChevronDown size={13} className="text-muted" />
              </button>
            )}

            {/* Input */}
            <div className="px-3 py-3 border-t border-border/10 shrink-0 bg-elevated">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                  placeholder="Ask me anything…"
                  className="flex-1 resize-none bg-overlay/5 border border-border/10 focus:border-primary/30 text-foreground placeholder-gray-600 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all max-h-24 overflow-y-auto"
                  style={{ lineHeight: "1.5" }}
                />
                <button onClick={() => send()} disabled={!input.trim() || isTyping}
                  className="w-9 h-9 rounded-full bg-primary hover:bg-primary disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-md shadow-primary/30 shrink-0">
                  <Send size={13} className="text-foreground ml-0.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating button ─────────────────────────────────────────────────── */}
      <motion.button
        onClick={() => setOpen((p) => !p)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        className="fixed bottom-5 right-5 z-50 w-13 h-13 rounded-full bg-gradient-to-br from-primary to-blue-700 shadow-xl shadow-primary/40 flex items-center justify-center"
        style={{ width: 52, height: 52 }}
        title="Chat with AI Coach"
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <X size={20} className="text-white" />
              </motion.div>
            : <motion.div key="spark" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <Sparkles size={20} className="text-white" />
              </motion.div>
          }
        </AnimatePresence>
      </motion.button>

      <style>{`@keyframes typingBounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}`}</style>
    </>
  );
}
