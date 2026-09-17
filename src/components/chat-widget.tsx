"use client";

/**
 * Floating chat/voice widget. Talks only to /api/chat (its own standalone
 * route) — zero imports from lib/ai/ or the feasibility/verdict routes, so
 * nothing here can affect or be affected by that pipeline. The mic button's
 * "recording" is still fully fake (local state + CSS only, no microphone
 * access); once it fake-stops, the hardcoded transcribed question is sent
 * to the same real /api/chat endpoint the text input uses.
 */

import { useEffect, useRef, useState } from "react";
import { Mic, MessageCircle, X } from "lucide-react";

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

const INITIAL_MESSAGES: ChatMessage[] = [
  { role: "user", text: "Is a dairy business viable in Channapatna?" },
  {
    role: "assistant",
    text: "Based on local demand and market data for Channapatna, small-scale dairy shows moderate viability — steady local demand, but margins depend on feed costs and distribution reach. Try the full intake form for a detailed feasibility report.",
  },
];

const TRANSCRIBED_MESSAGE = "What government schemes am I eligible for?";
const CLIENT_FALLBACK_REPLY = "I'm having trouble connecting right now — please try again in a moment.";

const RECORDING_DURATION_MS = 3000;
const WAVEFORM_BAR_COUNT = 16;
const WAVEFORM_TICK_MS = 120;

function formatTimer(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [barHeights, setBarHeights] = useState<number[]>(
    Array.from({ length: WAVEFORM_BAR_COUNT }, () => 20)
  );

  const waveformIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      if (waveformIntervalRef.current) clearInterval(waveformIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  async function sendToChatApi(userText: string) {
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });
      const data: unknown = await res.json();
      const reply =
        data && typeof data === "object" && "reply" in data && typeof (data as { reply: unknown }).reply === "string"
          ? (data as { reply: string }).reply
          : CLIENT_FALLBACK_REPLY;

      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", text: CLIENT_FALLBACK_REPLY }]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSend() {
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading) return;
    setInputValue("");
    void sendToChatApi(trimmed);
  }

  function startFakeRecording() {
    if (isRecording || isLoading) return;

    setIsRecording(true);
    setElapsedSeconds(0);

    waveformIntervalRef.current = setInterval(() => {
      setBarHeights(Array.from({ length: WAVEFORM_BAR_COUNT }, () => 15 + Math.random() * 85));
    }, WAVEFORM_TICK_MS);

    timerIntervalRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    stopTimeoutRef.current = setTimeout(() => {
      stopFakeRecording();
    }, RECORDING_DURATION_MS);
  }

  function stopFakeRecording() {
    if (waveformIntervalRef.current) clearInterval(waveformIntervalRef.current);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
    waveformIntervalRef.current = null;
    timerIntervalRef.current = null;
    stopTimeoutRef.current = null;

    setIsRecording(false);
    setElapsedSeconds(0);
    setBarHeights(Array.from({ length: WAVEFORM_BAR_COUNT }, () => 20));

    void sendToChatApi(TRANSCRIBED_MESSAGE);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close Lakshya Assistant" : "Open Lakshya Assistant"}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-dropdown transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[28rem] w-[22rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-dropdown">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-4 py-3">
            <span className="text-sm font-semibold text-white">Lakshya Assistant</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
              className="text-slate-300 transition-colors hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-4 py-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={
                    message.role === "user"
                      ? "max-w-[85%] rounded-2xl rounded-br-sm bg-blue-600 px-3 py-2 text-sm text-white"
                      : "max-w-[85%] rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-subtle"
                  }
                >
                  {message.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex max-w-[85%] items-center gap-1 rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-3 py-2.5 shadow-subtle">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="flex flex-col items-center gap-2 border-t border-slate-200 px-4 py-3">
            {isRecording && (
              <>
                <div className="flex h-8 items-end gap-[2px]">
                  {barHeights.map((height, index) => (
                    <div
                      key={index}
                      className="w-1 rounded-full bg-red-400 transition-all duration-150 ease-out"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
                <span className="text-xs font-medium text-slate-500">
                  {formatTimer(elapsedSeconds)}
                </span>
              </>
            )}

            <div className="flex w-full items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleSend();
                }}
                disabled={isLoading || isRecording}
                placeholder="Ask a question..."
                className="h-10 flex-1 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:opacity-50"
              />

              <button
                type="button"
                onClick={startFakeRecording}
                disabled={isRecording || isLoading}
                aria-label="Record a voice message (demo transcription)"
                className={
                  isRecording
                    ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500 text-white shadow-[0_0_0_6px_rgba(239,68,68,0.15)] animate-pulse"
                    : "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-colors hover:bg-slate-200 disabled:opacity-50"
                }
              >
                <Mic className="h-4 w-4" />
              </button>
            </div>
            <span className="text-[11px] text-slate-400">
              Voice input is a scripted demo — typed questions get real answers
            </span>
          </div>
        </div>
      )}
    </>
  );
}
