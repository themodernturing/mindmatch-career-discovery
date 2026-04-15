"use client";

import { X, Send, Bot, Sparkles, User, Briefcase, Zap, MessageCircle } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ScoreProfile } from '@/lib/types';

interface CareerMatch {
  name: string;
  match: number;
  category: string;
}

interface Strength {
  name: string;
  score: number;
}

interface CareerCoachProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  matchedCareers?: CareerMatch[];
  topStrengths?: Strength[];
  isReturningUser?: boolean;
  userContext: {
    profile: ScoreProfile;
    archetype: string;
    isClinical?: boolean;
    age?: string;
    gender?: string;
    school?: string;
    goals?: string;
    stage?: string;
  } | null;
}

type Tab = 'you' | 'careers' | 'strengths' | 'chat';

function renderMarkdown(text: string) {
  // Simple markdown: bold, line breaks
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br />');
}

export function CareerCoach({ isOpen, onClose, userName, matchedCareers = [], topStrengths = [], isReturningUser = false, userContext }: CareerCoachProps) {
  const [activeTab, setActiveTab] = useState<Tab>('you');
  const [localInput, setLocalInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<{ id: string; role: 'user' | 'assistant'; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const top3Careers = matchedCareers.slice(0, 5);
  const top3Strengths = topStrengths.slice(0, 3);
  const archetype = userContext?.archetype || 'a unique profile';
  const firstName = userName || 'there';

  const openingMessage = isReturningUser
    ? `Welcome back, ${firstName}. Your results are still here — you came out as a **${archetype}**${top3Careers[0] ? `, with **${top3Careers[0].name}** as your top match at ${top3Careers[0].match}% fit` : ''}. What do you want to dig into?`
    : `Hi ${firstName}! I've analysed your results. You came out as a **${archetype}** — ${
        top3Careers[0] ? `and your top career match is **${top3Careers[0].name}** at ${top3Careers[0].match}% fit` : 'with a strong and unique profile'
      }. Ask me anything about your results, career paths, or what to do next.`;

  useEffect(() => {
    setMessages([{ id: '1', role: 'assistant', content: openingMessage }]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async (content: string) => {
    const userMsg = { id: Date.now().toString(), role: 'user' as const, content };
    const assistantId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, userMsg, { id: assistantId, role: 'assistant', content: '' }]);
    setIsLoading(true);
    try {
      const allMsgs = [...messages, userMsg];
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: allMsgs.map(m => ({ role: m.role, content: m.content })), context: userContext }),
      });
      if (!res.ok || !res.body) throw new Error('API error');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: accumulated } : m));
      }
    } catch {
      setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: 'Sorry, something went wrong. Please try again.' } : m));
    } finally {
      setIsLoading(false);
    }
  }, [messages, userContext]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localInput.trim() || isLoading) return;
    setActiveTab('chat');
    sendMessage(localInput);
    setLocalInput('');
  };

  const askQuestion = (q: string) => {
    if (isLoading) return;
    setActiveTab('chat');
    sendMessage(q);
  };

  const suggestedQuestions = top3Careers[0] ? [
    `Why is ${top3Careers[0].name} a good fit for me?`,
    `What skills do I need for ${top3Careers[0].name}?`,
    `How do I develop my ${top3Strengths[0]?.name || 'top strength'}?`,
    `What should I do first to pursue ${top3Careers[0].name}?`,
  ] : [
    "What careers fit my personality?",
    "What active skills should I develop?",
    "Why did I get these results?",
  ];

  if (!isOpen) return null;

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'you', label: 'You', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'careers', label: 'Careers', icon: <Briefcase className="w-3.5 h-3.5" /> },
    { id: 'strengths', label: 'Strengths', icon: <Zap className="w-3.5 h-3.5" /> },
    { id: 'chat', label: 'Ask Coach', icon: <MessageCircle className="w-3.5 h-3.5" /> },
  ];

  return (
    <>
      {/* Backdrop — mobile only */}
      <div
        className="fixed inset-0 bg-black/60 z-[90] md:hidden"
        onClick={onClose}
      />

      {/* Panel — mobile: bottom sheet, desktop: right panel */}
      <div className={`
        fixed z-[100] bg-[#0f0f1a] border-white/10 flex flex-col
        bottom-0 left-0 right-0 h-[82vh] rounded-t-2xl border-t border-x
        md:inset-y-0 md:right-0 md:left-auto md:w-[420px] md:h-full md:rounded-none md:border-l md:border-t-0 md:border-x-0
        animate-in slide-in-from-bottom md:slide-in-from-right duration-300
      `}>
        {/* Drag handle — mobile only */}
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/8 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-black text-white">AI Career Coach</div>
              <div className="text-[10px] text-slate-500">Powered by GPT-4o</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/8 shrink-0 px-2 pt-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-bold rounded-t-lg transition-all mr-0.5 ${
                activeTab === tab.id
                  ? 'text-white border-b-2 border-blue-500 bg-white/5'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {/* YOU TAB */}
          {activeTab === 'you' && (
            <div className="p-4 space-y-4">
              {/* Archetype */}
              <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/20 rounded-xl p-4">
                <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Your Archetype</div>
                <div className="text-lg font-black text-white">{archetype}</div>
                {userName && <div className="text-xs text-slate-400 mt-1">{userName}&apos;s Profile</div>}
              </div>

              {/* Top RIASEC */}
              {userContext?.profile && (
                <div className="bg-white/4 border border-white/8 rounded-xl p-4">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Interest Profile</div>
                  <div className="space-y-2.5">
                    {[
                      { code: 'R', name: 'Realistic', score: userContext.profile.riasec_realistic, color: 'bg-emerald-500' },
                      { code: 'I', name: 'Investigative', score: userContext.profile.riasec_investigative, color: 'bg-blue-500' },
                      { code: 'A', name: 'Artistic', score: userContext.profile.riasec_artistic, color: 'bg-purple-500' },
                      { code: 'S', name: 'Social', score: userContext.profile.riasec_social, color: 'bg-yellow-400' },
                      { code: 'E', name: 'Enterprising', score: userContext.profile.riasec_enterprising, color: 'bg-red-500' },
                      { code: 'C', name: 'Conventional', score: userContext.profile.riasec_conventional, color: 'bg-slate-400' },
                    ]
                      .sort((a, b) => b.score - a.score)
                      .slice(0, 3)
                      .map(dim => (
                        <div key={dim.code}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-300 font-medium">{dim.name}</span>
                            <span className="text-white font-bold">{dim.score}</span>
                          </div>
                          <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${dim.color}`} style={{ width: `${dim.score}%` }} />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Ask a personalised question */}
              <div className="bg-white/4 border border-white/8 rounded-xl p-4">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Quick Questions</div>
                <div className="space-y-2">
                  {suggestedQuestions.slice(0, 3).map(q => (
                    <button
                      key={q}
                      onClick={() => askQuestion(q)}
                      className="w-full text-left text-xs text-slate-300 hover:text-white bg-white/4 hover:bg-white/8 border border-white/8 rounded-lg px-3 py-2.5 transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CAREERS TAB */}
          {activeTab === 'careers' && (
            <div className="p-4 space-y-3">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Your Top Career Matches</div>
              {top3Careers.length === 0 && (
                <p className="text-slate-500 text-sm px-1">No career data available.</p>
              )}
              {top3Careers.map((career) => (
                <div key={career.name} className="bg-white/4 border border-white/8 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-sm font-bold text-white">{career.name}</div>
                      <div className="text-[11px] text-slate-500">{career.category}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black text-blue-400">{career.match}%</div>
                      <div className="text-[10px] text-slate-500">match</div>
                    </div>
                  </div>
                  <div className="h-1 bg-white/8 rounded-full overflow-hidden mb-3">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${career.match}%` }} />
                  </div>
                  <button
                    onClick={() => askQuestion(`Why is ${career.name} a good fit for me? What should I do to pursue it?`)}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition-colors"
                  >
                    Ask why this fits me →
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* STRENGTHS TAB */}
          {activeTab === 'strengths' && (
            <div className="p-4 space-y-3">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Your Top Strengths</div>
              {top3Strengths.length === 0 && (
                <p className="text-slate-500 text-sm px-1">No strength data available.</p>
              )}
              {top3Strengths.map((strength) => (
                <div key={strength.name} className="bg-white/4 border border-white/8 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-bold text-white">{strength.name}</div>
                    <div className="text-sm font-black text-indigo-400">{strength.score}%</div>
                  </div>
                  <div className="h-1 bg-white/8 rounded-full overflow-hidden mb-3">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${strength.score}%` }} />
                  </div>
                  <button
                    onClick={() => askQuestion(`How can I develop my ${strength.name} strength further? What careers value this most?`)}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition-colors"
                  >
                    How do I develop this? →
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* CHAT TAB */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-full">
              {/* Sticky data strip */}
              <div className="bg-white/3 border-b border-white/8 px-4 py-2 flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span className="text-[11px] text-slate-400 font-medium">{archetype}</span>
                </div>
                {top3Careers[0] && (
                  <>
                    <span className="text-slate-700">·</span>
                    <span className="text-[11px] text-slate-400">{top3Careers[0].name} {top3Careers[0].match}%</span>
                  </>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {messages.map((m: any) => (
                  <div key={m.id} className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {m.role === 'assistant' && (
                      <div className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-4 h-4 text-blue-400" />
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-2.5 max-w-[85%] text-sm leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-blue-600 text-white rounded-br-sm'
                          : 'bg-white/8 border border-white/10 text-slate-200 rounded-bl-sm'
                      }`}
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(m.content) }}
                    />
                    {m.role === 'user' && (
                      <div className="w-7 h-7 rounded-full bg-white/8 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-4 h-4 text-slate-400" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-2.5 justify-start">
                    <div className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-500/30 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="rounded-2xl px-4 py-3 bg-white/8 border border-white/10 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-75" />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-150" />
                    </div>
                  </div>
                )}

                {/* Suggested questions — only when on first message */}
                {messages.length === 1 && (
                  <div className="pt-2">
                    <p className="text-[11px] text-slate-500 mb-2 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Tap to ask
                    </p>
                    <div className="flex flex-col gap-2">
                      {suggestedQuestions.map(q => (
                        <button
                          key={q}
                          onClick={() => askQuestion(q)}
                          className="text-left text-xs text-slate-300 hover:text-white bg-white/4 hover:bg-white/8 border border-white/8 rounded-xl px-3 py-2.5 transition-all"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>
          )}
        </div>

        {/* Chat Input — always visible */}
        <div className="p-3 border-t border-white/8 shrink-0 bg-[#0f0f1a]">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              value={localInput}
              onChange={e => setLocalInput(e.target.value)}
              onFocus={() => setActiveTab('chat')}
              placeholder="Ask your Career Coach..."
              className="flex-1 bg-white/6 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!localInput.trim() || isLoading}
              className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all active:scale-95 shrink-0"
            >
              <Send className="w-4 h-4 text-white ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
