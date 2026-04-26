"use client";

import { Send, Bot, Sparkles, User, Briefcase, Zap, MessageCircle } from 'lucide-react';
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

interface CareerCoachInlineProps {
  userName?: string;
  matchedCareers?: CareerMatch[];
  topStrengths?: Strength[];
  isReturningUser?: boolean;
  userContext: {
    profile: ScoreProfile;
    archetype: string;
    age?: string;
    gender?: string;
    school?: string;
    goals?: string;
    stage?: string;
  } | null;
}

type Tab = 'you' | 'careers' | 'strengths';

function renderMarkdown(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br />');
}

export function CareerCoachInline({
  userName,
  matchedCareers = [],
  topStrengths = [],
  isReturningUser = false,
  userContext,
}: CareerCoachInlineProps) {
  const [activeTab, setActiveTab] = useState<Tab>('you');
  const [localInput, setLocalInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<{ id: string; role: 'user' | 'assistant'; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const firstName = userName || 'there';
  const archetype = userContext?.archetype || 'a unique profile';
  const top5Careers = matchedCareers.slice(0, 5);
  const top3Strengths = topStrengths.slice(0, 3);

  const goals = userContext?.goals?.trim()
  const openingMessage = isReturningUser
    ? `Welcome back, ${firstName}. You're a **${archetype}**${top5Careers[0] ? ` — top match is **${top5Careers[0].name}** at ${top5Careers[0].match}%` : ''}. What do you want to explore?`
    : goals
      ? `Hi ${firstName}! You came in asking: *"${goals}"* — I've got your results in front of me and I can speak directly to that. You're a **${archetype}**${top5Careers[0] ? `, top match **${top5Careers[0].name}** at ${top5Careers[0].match}%` : ''}. Ask me anything or I can start by addressing your question.`
      : `Hi ${firstName}! You're a **${archetype}**${top5Careers[0] ? ` — your top match is **${top5Careers[0].name}** at ${top5Careers[0].match}% fit` : ''}. Ask me anything about your results, career paths, or what to do next.`;

  useEffect(() => {
    setMessages([{ id: '1', role: 'assistant', content: openingMessage }]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const suggestedQuestions = top5Careers[0] ? [
    `Why is ${top5Careers[0].name} a good fit for me?`,
    `What skills do I need for ${top5Careers[0].name}?`,
    top5Careers[1] ? `Compare ${top5Careers[0].name} vs ${top5Careers[1].name}` : `What degree should I pursue?`,
    `What should I do this week to move forward?`,
  ] : [
    'What careers fit my personality?',
    'What are my key strengths?',
    'What should I do next?',
  ];

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

  useEffect(() => {
    if (messages.length > 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localInput.trim() || isLoading) return;
    sendMessage(localInput);
    setLocalInput('');
  };

  const askQuestion = (q: string) => {
    if (isLoading) return;
    sendMessage(q);
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'you', label: 'You', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'careers', label: 'Careers', icon: <Briefcase className="w-3.5 h-3.5" /> },
    { id: 'strengths', label: 'Strengths', icon: <Zap className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden print:hidden shadow-sm">

      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-200 bg-white">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="text-sm font-black text-slate-900">AI Career Coach</div>
          <div className="text-[11px] text-slate-400">{firstName}&apos;s personal coach · Powered by GPT-4o</div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-emerald-600 font-semibold">Online</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col lg:flex-row" style={{ minHeight: 540 }}>

        {/* ── Left: tabs panel ── */}
        <div className="lg:w-[360px] lg:border-r border-slate-200 flex flex-col shrink-0">

          {/* Tab bar */}
          <div className="flex border-b border-slate-200 px-2 pt-1 bg-slate-50">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all mr-0.5 ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-white -mb-px'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content — scrollable */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">

            {/* YOU TAB */}
            {activeTab === 'you' && (
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Your Archetype</div>
                  <div className="text-lg font-black text-slate-900">{archetype}</div>
                  {userName && <div className="text-xs text-slate-500 mt-1">{userName}&apos;s Profile</div>}
                </div>

                {userContext?.profile && (
                  <div className="bg-white border border-slate-200 rounded-xl p-4">
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
                        .map(dim => (
                          <div key={dim.code}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-600 font-medium flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${dim.color}`} />
                                {dim.name}
                              </span>
                              <span className="text-slate-800 font-bold">{dim.score}</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${dim.color}`} style={{ width: `${dim.score}%` }} />
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Quick Questions</div>
                  <div className="space-y-2">
                    {suggestedQuestions.slice(0, 3).map(q => (
                      <button
                        key={q}
                        onClick={() => askQuestion(q)}
                        className="w-full text-left text-xs text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-lg px-3 py-2.5 transition-all"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* CAREERS TAB */}
            {activeTab === 'careers' && (
              <>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Your Top Career Matches</div>
                {top5Careers.map((career, i) => (
                  <div key={career.name} className="bg-white border border-slate-200 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${i === 0 ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>#{i + 1}</span>
                          <div className="text-sm font-bold text-slate-900">{career.name}</div>
                        </div>
                        <div className="text-[11px] text-slate-400">{career.category}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-black text-blue-600">{career.match}%</div>
                        <div className="text-[10px] text-slate-400">match</div>
                      </div>
                    </div>
                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden mb-3">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${career.match}%` }} />
                    </div>
                    <button
                      onClick={() => askQuestion(`Why is ${career.name} a good fit for me? What should I do to pursue it?`)}
                      className="text-[11px] text-blue-600 hover:text-blue-500 font-semibold transition-colors"
                    >
                      Ask why this fits me →
                    </button>
                  </div>
                ))}
              </>
            )}

            {/* STRENGTHS TAB */}
            {activeTab === 'strengths' && (
              <>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Your Top Strengths</div>
                {top3Strengths.map((strength, i) => (
                  <div key={strength.name} className="bg-white border border-slate-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-bold text-slate-900">{strength.name}</div>
                      <div className="text-sm font-black text-indigo-600">{strength.score}%</div>
                    </div>
                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden mb-3">
                      <div
                        className={`h-full rounded-full ${i === 0 ? 'bg-blue-500' : i === 1 ? 'bg-indigo-500' : 'bg-purple-500'}`}
                        style={{ width: `${strength.score}%` }}
                      />
                    </div>
                    <button
                      onClick={() => askQuestion(`How can I develop my ${strength.name} strength? What careers value this most?`)}
                      className="text-[11px] text-indigo-600 hover:text-indigo-500 font-semibold transition-colors"
                    >
                      How do I develop this? →
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* ── Right: chat panel ── */}
        <div className="flex-1 flex flex-col border-t lg:border-t-0 border-slate-200">

          {/* Sticky data strip */}
          <div className="bg-slate-50 border-b border-slate-200 px-5 py-2 flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span className="text-[11px] text-slate-500 font-medium">{archetype}</span>
            </div>
            {top5Careers[0] && (
              <>
                <span className="text-slate-300">·</span>
                <span className="text-[11px] text-slate-400">{top5Careers[0].name} {top5Careers[0].match}%</span>
              </>
            )}
            {top3Strengths[0] && (
              <>
                <span className="text-slate-300">·</span>
                <span className="text-[11px] text-slate-400">{top3Strengths[0].name}</span>
              </>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-white" style={{ maxHeight: 440 }}>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {messages.map((m: any) => (
              <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </div>
                )}
                <div
                  className={`rounded-2xl px-4 py-2.5 max-w-[80%] text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : 'bg-slate-100 border border-slate-200 text-slate-700 rounded-bl-sm'
                  }`}
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(m.content) }}
                />
                {m.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4 text-slate-500" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-blue-600" />
                </div>
                <div className="rounded-2xl px-4 py-3 bg-slate-100 border border-slate-200 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-75" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-150" />
                </div>
              </div>
            )}

            {/* Suggested questions on first load */}
            {messages.length === 1 && (
              <div className="pt-1">
                <p className="text-[11px] text-slate-400 mb-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Tap to ask
                </p>
                <div className="flex flex-col gap-2">
                  {suggestedQuestions.map(q => (
                    <button
                      key={q}
                      onClick={() => askQuestion(q)}
                      className="text-left text-xs text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-xl px-3 py-2.5 transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-200 shrink-0 bg-white">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                value={localInput}
                onChange={e => setLocalInput(e.target.value)}
                placeholder={`Ask your Career Coach anything...`}
                disabled={isLoading}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 transition-colors"
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
      </div>
    </div>
  );
}
