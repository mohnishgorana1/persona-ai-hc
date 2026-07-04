"use client";

import { useState, useEffect, useRef } from "react";
import {
  Send, User, Bot, BrainCircuit, Menu, X,
  Terminal, Code2, Cpu, ChevronLeft, ChevronRight, ArrowRight, LogOut,
  BotIcon,
  Database
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

type ChainStep = {
  step: string;
  content: string;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  chain?: ChainStep[];
};

// 📌 Props interface for the Sidebar Component
interface SidebarContentProps {
  isMobile?: boolean;
  isSidebarCollapsed: boolean;
  userName: string;
  isNameSet: boolean;
  onSignOut: () => void;
  onCloseMobile: () => void;
}

// 📌 Sidebar Content Component (Moved OUTSIDE to prevent re-render issues)
const SidebarContent = ({
  isMobile = false,
  isSidebarCollapsed,
  userName,
  isNameSet,
  onSignOut,
  onCloseMobile
}: SidebarContentProps) => (
  <div className="flex flex-col h-full overflow-hidden">
    <div className={`flex items-center justify-between py-5 border-b border-neutral-800 transition-all duration-300 ${isSidebarCollapsed && !isMobile ? 'px-3 justify-center' : 'px-6'}`}>
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="w-10 h-10 bg-orange-800 rounded-xl shrink-0 flex items-center justify-center font-black text-white shadow-lg shadow-orange-900/20">
          <BotIcon />
        </div>
        <div className={`flex flex-col transition-all duration-300 overflow-hidden ${isSidebarCollapsed && !isMobile ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
          <h1 className="font-bold text-lg text-neutral-100 tracking-tight leading-tight whitespace-nowrap">PersonaAI</h1>
          <p className="text-[10px] uppercase tracking-wider text-orange-500/80 font-semibold whitespace-nowrap">Your Personal HC</p>
        </div>
      </div>

      {isMobile && (
        <button
          onClick={onCloseMobile}
          className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>
      )}
    </div>

    {/* App Details / Middle Content */}
    <div className={`mt-6 flex-1 space-y-5 overflow-y-auto transition-all duration-300 ${isSidebarCollapsed && !isMobile ? 'px-2' : 'px-4'}`}>
      {!(isSidebarCollapsed && !isMobile) ? (
        <>
          <div className="p-4 bg-neutral-950/50 rounded-2xl border border-neutral-800/50">
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">About Agent</h3>
            <p className="text-sm text-neutral-300 leading-relaxed">
              Developed for the <strong className="text-neutral-100">GenAI with JS 2026</strong> cohort, this agent acts as your personal Hitesh Sir. Expect deep dives into architecture, practical debugging, and absolutely zero spoon-feeding.
            </p>
          </div>

          <div className="p-4 bg-neutral-950/50 rounded-2xl border border-neutral-800/50 shadow-lg">
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">Core Capabilities</h3>
            <ul className="text-sm text-neutral-300 space-y-3.5">
              <li className="flex items-center gap-3 group cursor-default">
                <BrainCircuit size={16} className="text-orange-500 group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-white transition-colors">Chain of Thought Reasoning</span>
              </li>
              <li className="flex items-center gap-3 group cursor-default">
                <Cpu size={16} className="text-blue-500 group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-white transition-colors">Tavily Real-time Search</span>
              </li>
              <li className="flex items-center gap-3 group cursor-default">
                <Code2 size={16} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-white transition-colors">VS-Code Style Formatting</span>
              </li>
              <li className="flex items-center gap-3 group cursor-default">
                <Database size={16} className="text-amber-500 group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-white transition-colors">Contextual Memory</span>
              </li>
            </ul>
          </div>
        </>
      ) : (
        // Collapsed Icons
        <div className="flex flex-col items-center space-y-6 pt-4">
          <BrainCircuit size={20} className="text-orange-500" />
          <Cpu size={20} className="text-blue-500" />
          <Code2 size={20} className="text-emerald-500" />
          <Database size={20} className="text-amber-500" />
        </div>
      )}
    </div>z

    {/* 🚀 User Section & Footer  */}
    <div className="mt-auto flex flex-col">
      {/* User Profile / Sign Out Button */}
      {isNameSet && (
        <div className="px-4 py-2 border-t border-neutral-400/20">
          <div
            className={`flex items-center w-full py-2 rounded-xl transition-all group ${isSidebarCollapsed && !isMobile ? 'justify-center' : 'justify-between'}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex flex-shrink-0 items-center justify-center font-bold text-neutral-300 transition-colors">
                {userName.charAt(0).toUpperCase()}
              </div>
              {!(isSidebarCollapsed && !isMobile) && (
                <div className="flex flex-col items-start overflow-hidden">
                  <span className="text-sm font-medium text-neutral-200 truncate max-w-[120px]">{userName}</span>
                  <span className="text-[10px] text-neutral-500">Student</span>
                </div>
              )}
            </div>
            {!(isSidebarCollapsed && !isMobile) && (
              <button
                onClick={onSignOut}
                title="Sign Out"
                className="group"
              >
                <LogOut size={20} className="cursor-pointer hover:font-bold text-neutral-500 hover:text-neutral-200 transition-colors shrink-0" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className={`p-4 border-t border-neutral-800 flex flex-col items-center justify-center gap-1 bg-neutral-950/20 transition-all duration-300 ${isSidebarCollapsed && !isMobile ? 'opacity-0 h-0 p-0 overflow-hidden border-t-0' : 'opacity-100'}`}>
        <span className="text-xs text-neutral-500 whitespace-nowrap">Developed by</span>
        <span className="text-xs font-medium text-neutral-300 whitespace-nowrap">Mohnish Gorana</span>
      </div>
    </div>
  </div>
);

export default function ChatPage() {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Layout & Onboarding States
  const [isMounted, setIsMounted] = useState(false);
  const [userName, setUserName] = useState("");
  const [isNameSet, setIsNameSet] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile Drawer
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // Desktop Collapsible

  // Chat States
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  // 🎬 Initialize Chat with User's Name
  const initializeChat = (name: string) => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "1",
          role: "assistant",
          content: `Haanji ${name}! Swagat hai aapka Chai aur Code me. Hitesh here.\n\nBatao, aaj architecture discuss karna hai ya bug fix karein? Chai tayar hai na?`,
        },
      ]);
    }
  };

  // 📝 Handle Name Submit
  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;
    const finalName = userName.trim();
    localStorage.setItem("persona_user_name", finalName);
    setIsNameSet(true);
    initializeChat(finalName);
  };

  // 🚪 Handle Sign Out
  const handleSignOut = () => {
    localStorage.removeItem("persona_user_name");
    setUserName("");
    setIsNameSet(false);
    setMessages([]);
    setIsSidebarOpen(false); // Close mobile drawer if open
  };

  // 💬 Handle Chat Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput("");
    setIsLoading(true);

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userText,
    };

    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userName: userName, // Sending user name for context
        }),
      });

      const data = await res.json();

      if (data.success && data.steps) {
        const wrapUpStep = data.steps.find((s: ChainStep) => s.step === "wrap_up");
        const finalContent = wrapUpStep ? wrapUpStep.content : "Sorry yaar, lagta hai API me thoda issue hai. Phir try karein?";

        const newBotMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: finalContent,
          chain: data.steps,
        };

        setMessages((prev) => [...prev, newBotMsg]);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: `Oops ${userName}! API ne ek kadak error phenka hai. Apni API key aur Tavily key check kar lo bhaida.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔄 Hydration & Local Storage Check
  useEffect(() => {
    setIsMounted(true);
    const storedName = localStorage.getItem("persona_user_name");
    if (storedName) {
      setUserName(storedName);
      setIsNameSet(true);
      initializeChat(storedName);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);


  if (!isMounted) return <div className="h-screen bg-neutral-950"></div>;

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-200 overflow-hidden font-sans">

      {/* ========================================== */}
      {/* 📱 MOBILE DRAWNER OVERLAY & SIDEBAR        */}
      {/* ========================================== */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-neutral-900 border-r border-neutral-800 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <SidebarContent
          isMobile={true}
          isSidebarCollapsed={false}
          userName={userName}
          isNameSet={isNameSet}
          onSignOut={handleSignOut}
          onCloseMobile={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* ========================================== */}
      {/* 💻 DESKTOP COLLAPSIBLE SIDEBAR             */}
      {/* ========================================== */}
      <div className={`hidden md:flex flex-col bg-neutral-900 border-r border-neutral-800 transition-all duration-300 ease-in-out relative ${isSidebarCollapsed ? 'w-20' : 'w-72'}`}>
        <SidebarContent
          isMobile={false}
          isSidebarCollapsed={isSidebarCollapsed}
          userName={userName}
          isNameSet={isNameSet}
          onSignOut={handleSignOut}
          onCloseMobile={() => { }}
        />

        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-3.5 top-8 bg-neutral-800 border border-neutral-700 text-neutral-400 p-1.5 rounded-full z-50 hover:bg-orange-800 hover:text-white hover:border-orange-500 transition-all shadow-md"
        >
          {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* ========================================== */}
      {/* 💬 MAIN CONTENT AREA                       */}
      {/* ========================================== */}
      <div className="flex-1 flex flex-col h-full w-full relative min-w-0 bg-neutral-950">

        {/* Mobile Header (Hamburger Menu) */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-900/90 backdrop-blur-md z-30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-800 rounded-lg flex items-center justify-center font-bold text-white text-sm">HC</div>
            <span className="font-semibold text-neutral-100">PersonaAI</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* 🎯 ONBOARDING SCREEN (If Name is not set) */}
        {!isNameSet ? (
          <div className="flex-1 flex flex-col items-center justify-center px-4 relative z-10">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-orange-900/20 via-neutral-950 to-neutral-950 -z-10"></div>

            <div className="bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 p-8 sm:p-10 rounded-3xl w-full max-w-md shadow-2xl flex flex-col items-center text-center transform transition-all">
              <div className="w-16 h-16 bg-linear-to-br from-orange-500 to-orange-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-orange-900/30">
                <Bot size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-100 mb-2">Welcome to PersonaAI</h2>
              <p className="text-neutral-400 text-sm mb-8">Let&apos;s set up your profile before we start coding with Hitesh Sir.</p>

              <form onSubmit={handleNameSubmit} className="w-full flex flex-col gap-4">
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your name..."
                    autoFocus
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl py-3 pl-11 pr-4 text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!userName.trim()}
                  className="w-full bg-orange-800 hover:bg-orange-500 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                  Start Coding <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        ) : (

          /* 💬 ACTUAL CHAT INTERFACE (If Name is set) */
          <>
            {/* Chat Messages Container */}
            <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8 pb-36 space-y-8 scroll-smooth">
              <div className="max-w-4xl mx-auto space-y-8">
                {messages.map((m) => (
                  <div key={m.id} className={`flex w-full ${m.role === "user" ? "justify-end" : "justify-start"}`}>

                    {/* 🤖 Assistant Message */}
                    {m.role === "assistant" && (
                      <div className="flex gap-4 w-full">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-neutral-200 flex items-center justify-center shadow-sm">
                            <Bot size={20} className="text-neutral-950" />
                          </div>
                        </div>

                        <div className="flex flex-col w-full min-w-0">

                          {/* Cognitive Loop Display */}
                          {m.chain && (
                            <details className="mb-4 text-xs text-neutral-500 cursor-pointer group w-fit">
                              <summary className="flex items-center gap-2 hover:text-neutral-300 transition-colors select-none">
                                <BrainCircuit size={14} className="text-orange-500/80" />
                                <span>View Hitesh Sir&apos;s Reasoning Process</span>
                              </summary>
                              <div className="mt-3 pl-3 pr-4 py-3 border-l-2 border-neutral-800 bg-neutral-900/40 rounded-r-xl space-y-3 max-w-2xl">
                                {m.chain.filter(c => c.step !== "wrap_up").map((c, idx) => (
                                  <div key={idx} className="flex flex-col">
                                    <span className="font-mono font-semibold text-orange-500/60 uppercase text-[10px] tracking-wider mb-1">
                                      Step: {c.step}
                                    </span>
                                    <span className="text-neutral-400 italic leading-relaxed">&quot;{c.content}&quot;</span>
                                  </div>
                                ))}
                              </div>
                            </details>
                          )}

                          {/* Rendered Markdown Output */}
                          <div className="prose prose-invert max-w-none text-neutral-200 leading-relaxed">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                code({ node, inline, className, children, ...props }: unknown) {
                                  const match = /language-(\w+)/.exec(className || "");
                                  return !inline && match ? (
                                    <div className="rounded-xl overflow-hidden my-5 border border-neutral-800 shadow-xl">
                                      <div className="bg-neutral-900 text-xs text-neutral-400 px-4 py-2.5 flex items-center gap-2 font-mono border-b border-neutral-800">
                                        <Terminal size={14} />
                                        <span>{match[1]}</span>
                                      </div>
                                      <SyntaxHighlighter
                                        style={vscDarkPlus as unknown}
                                        language={match[1]}
                                        PreTag="div"
                                        customStyle={{ margin: 0, padding: "1.25rem", background: "#0a0a0a", fontSize: "0.875rem" }}
                                        {...props}
                                      >
                                        {String(children).replace(/\n$/, "")}
                                      </SyntaxHighlighter>
                                    </div>
                                  ) : (
                                    <code className="bg-neutral-800 text-orange-300 px-1.5 py-0.5 rounded-md text-sm font-mono shadow-sm" {...props}>
                                      {children}
                                    </code>
                                  );
                                },
                                p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                                ul: ({ children }) => <ul className="list-disc ml-5 mb-4 text-neutral-300 space-y-1">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal ml-5 mb-4 text-neutral-300 space-y-1">{children}</ol>,
                                a: ({ children, href }) => <a href={href} target="_blank" rel="noreferrer" className="text-orange-500 hover:underline">{children}</a>
                              }}
                            >
                              {m.content}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 🧑 User Message */}
                    {m.role === "user" && (
                      <div className="flex gap-4 max-w-[90%] md:max-w-[70%] flex-row-reverse">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-neutral-800 flex items-center justify-center shadow-sm border border-neutral-700">
                            <span className="font-bold text-neutral-300 text-sm">{userName.charAt(0).toUpperCase()}</span>
                          </div>
                        </div>
                        <div className="inline-block bg-neutral-800 border border-neutral-700/50 text-neutral-100 px-5 py-3 rounded-2xl rounded-tr-sm shadow-md">
                          {m.content}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing Indicator */}
                {isLoading && (
                  <div className="flex gap-4 w-full max-w-4xl mx-auto">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-neutral-200 flex items-center justify-center shadow-sm">
                        <Bot size={20} className="text-neutral-950" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 pt-2">
                      <div className="text-xs text-orange-500/80 font-mono tracking-widest uppercase animate-pulse">
                        Processing Cognitive Loop...
                      </div>
                      <div className="flex items-center gap-1.5 h-4">
                        <div className="w-1.5 h-1.5 bg-neutral-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-1.5 h-1.5 bg-neutral-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-1.5 h-1.5 bg-neutral-600 rounded-full animate-bounce"></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-neutral-950 via-neutral-950/90 to-transparent pt-10 pb-6 px-4 md:px-8">
              <div className="max-w-4xl mx-auto relative">
                <form
                  onSubmit={handleSubmit}
                  className="flex items-end gap-2 bg-neutral-900 rounded-3xl p-2 border border-neutral-800 transition-all focus-within:border-neutral-700 shadow-2xl"
                >
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e as any);
                      }
                    }}
                    placeholder={`Message Hitesh Sir, ${userName}...`}
                    className="flex-1 max-h-32 min-h-11 bg-transparent resize-none px-4 py-3 focus:outline-none text-neutral-200 placeholder-neutral-500 text-base"
                    rows={1}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="p-3 mb-0.5 bg-orange-800 text-white rounded-full hover:bg-orange-500 disabled:bg-neutral-800 disabled:text-neutral-600 transition-colors shrink-0 shadow-md"
                  >
                    <Send size={18} />
                  </button>
                </form>
                <div className="text-center mt-3 text-xs text-neutral-600 font-medium tracking-wide">
                  AI Mentor Persona - Powered by GPT-4o-mini & Chain of Thought
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}