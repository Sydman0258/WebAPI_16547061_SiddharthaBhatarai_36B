"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { handlechatRecommendation } from "@/lib/actions/ollama_actions";

type Message = {
  role: "user" | "assistant";
  content: string;
};

interface ChatModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ChatModal({
  open,
  onClose,
}: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! 👋 I'm your AI food assistant. Ask me for recommendations, restaurants, or meals within your budget.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  // Only render the portal once we're on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  if (!open || !mounted) return null;

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const prompt = input;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: prompt,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await handlechatRecommendation(prompt);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            response.data ??
            response.message ??
            "No response received.",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      <div className="flex h-[700px] w-[450px] max-h-[90vh] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4 bg-gradient-to-r from-orange-500 to-rose-500">
          <div>
            <h2 className="text-lg font-semibold text-white">
              AI Food Assistant
            </h2>
            <p className="text-sm text-orange-50">
              Powered by Ollama
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-2xl text-white/80 hover:text-white transition-colors"
          >
            ×
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto bg-orange-50/40 p-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white"
                    : "bg-white text-stone-900 shadow"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-white px-4 py-3 shadow text-stone-500">
                Thinking...
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t p-4 bg-white">
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-xl border px-4 py-3 outline-none text-stone-900 placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500"
              placeholder="Ask for food recommendations..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />

            <button
              onClick={sendMessage}
              disabled={loading}
              className="rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-5 text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}