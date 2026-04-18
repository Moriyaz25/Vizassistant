import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Zap, Loader2, Globe, Database, FileText, TrendingUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

// ─── PASTE YOUR OPENROUTER KEY HERE ───────────────────────────────────────────
const OR_KEY = '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';
// ──────────────────────────────────────────────────────────────────────────────

const LANGUAGES = [
  { code: 'auto', label: '🌐 Auto' },
  { code: 'en',   label: '🇺🇸 English' },
  { code: 'hi',   label: '🇮🇳 Hindi' },
  { code: 'ur',   label: '🇵🇰 Urdu' },
 
];

const SUGGESTIONS = [
  'Summarize all my datasets',
  'Which dataset has the most rows?',
  'What insights have been generated?',
  'Show trends across my data',
];

const AIInsightSidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const [datasets, setDatasets]       = useState([]);
  const [insights, setInsights]       = useState([]);
  const [selectedDs, setSelectedDs]   = useState('all');
  const [dataLoading, setDataLoading] = useState(true);

  const [messages, setMessages]       = useState([]);
  const [input, setInput]             = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [lang, setLang]               = useState('auto');

  const bottomRef = useRef(null);

  // ─── Fetch all user data (NO orderBy to avoid index requirement) ───────────
  useEffect(() => {
    if (!isOpen || !user) return;

    const fetchAll = async () => {
      setDataLoading(true);
      try {
        // 1. Fetch datasets — no orderBy, sort client-side
        const dsSnap = await getDocs(
          query(
            collection(db, 'datasets'),
            where('user_id', '==', user.uid)
          )
        );

        const dsArr = dsSnap.docs
          .map(d => ({
            id: d.id,
            ...d.data(),
            upload_date:
              d.data().upload_date?.toDate?.()?.toISOString() ||
              new Date().toISOString(),
          }))
          // sort newest first on the client
          .sort((a, b) => new Date(b.upload_date) - new Date(a.upload_date));

        setDatasets(dsArr);

        // 2. Fetch insights for those datasets
        let insArr = [];
        if (dsArr.length > 0) {
          const dsIds  = dsArr.map(d => d.id);
          // Chunk into groups of 30 (Firestore 'in' limit)
          const chunks = [];
          for (let i = 0; i < dsIds.length; i += 30) {
            chunks.push(dsIds.slice(i, i + 30));
          }
          for (const chunk of chunks) {
            const inSnap = await getDocs(
              query(
                collection(db, 'insights'),
                where('dataset_id', 'in', chunk)
              )
            );
            insArr.push(...inSnap.docs.map(d => ({ id: d.id, ...d.data() })));
          }
        }
        setInsights(insArr);

        // 3. Set welcome message
        setMessages([{
          role: 'assistant',
          content: dsArr.length > 0
            ? `Hi **${user.displayName?.split(' ')[0] || 'there'}**! 👋\n\nI have access to your **${dsArr.length} dataset${dsArr.length > 1 ? 's' : ''}** and **${insArr.length} insight report${insArr.length > 1 ? 's' : ''}**.\n\nAsk me anything — in any language!`
            : `Hi! You haven't uploaded any datasets yet. Go to **Upload** to get started!`,
        }]);
      } catch (err) {
        console.error('Sidebar fetch error:', err);
        setMessages([{
          role: 'assistant',
          content: `⚠️ Could not load your data: ${err.message}`,
        }]);
      } finally {
        setDataLoading(false);
      }
    };

    fetchAll();
  }, [isOpen, user]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chatLoading]);

  // ─── Build system prompt ───────────────────────────────────────────────────
  const buildSystemPrompt = () => {
    const langLine =
      lang === 'auto'
        ? "Detect the user's language and always reply in that same language."
        : `Always respond in ${LANGUAGES.find(l => l.code === lang)?.label?.split(' ').slice(1).join(' ') || 'English'}.`;

    const activeDsList =
      selectedDs === 'all'
        ? datasets
        : datasets.filter(d => d.id === selectedDs);

    const dsContext = activeDsList
      .map(ds => {
        const rows = Array.isArray(ds.raw_data) ? ds.raw_data.slice(0, 150) : [];
        const cols = rows.length > 0 ? Object.keys(rows[0]) : [];
        return `
--- Dataset: "${ds.file_name}" ---
Uploaded : ${new Date(ds.upload_date).toLocaleDateString()}
Rows     : ${ds.row_count} | Columns: ${ds.column_count}
Columns  : ${cols.join(', ')}
Data (first 150 rows):
${JSON.stringify(rows).slice(0, 5000)}`;
      })
      .join('\n');

    const insContext = insights
      .filter(ins => selectedDs === 'all' || ins.dataset_id === selectedDs)
      .map(ins => {
        const name =
          datasets.find(d => d.id === ins.dataset_id)?.file_name || ins.dataset_id;
        return `\n--- AI Insight for "${name}" ---\n${ins.summary_text}`;
      })
      .join('\n');

    return `You are an expert AI data analyst copilot inside a personal analytics dashboard.
${langLine}

USER: ${user?.displayName || user?.email || 'Unknown'}
Total datasets : ${datasets.length}
Total insights : ${insights.length}
Viewing        : ${selectedDs === 'all' ? 'All datasets' : datasets.find(d => d.id === selectedDs)?.file_name || selectedDs}

${dsContext ? `DATASET DATA:\n${dsContext}` : 'No datasets available.'}
${insContext ? `\nPREVIOUS AI INSIGHTS:\n${insContext}` : ''}

RULES:
- Answer from the real data above only.
- Be concise (under 250 words) unless more detail is asked.
- Use bullet points for lists, bold for key numbers.
- Never make up data that isn't provided.`;
  };

  // ─── Send message ──────────────────────────────────────────────────────────
  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || chatLoading) return;

    setInput('');
    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setChatLoading(true);

    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OR_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'DataDash AI Copilot',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-flash-001',
          messages: [
            { role: 'system', content: buildSystemPrompt() },
            ...newMessages,
          ],
          max_tokens: 1000,
          temperature: 0.6,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || `HTTP ${res.status}`);
      }

      const reply =
        data.choices?.[0]?.message?.content || 'No response received.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error('OpenRouter error:', err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ Error: ${err.message}`,
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            // CHANGE to (add overflow-visible):
className="fixed right-0 top-0 h-full w-full max-w-md bg-[#060817] border-l border-[#ACBBC6]/10 z-[70] shadow-2xl flex flex-col overflow-visible"
          >
            {/* ── Header ── */}
            <div className="shrink-0 p-5 border-b border-[#ACBBC6]/10 bg-white/[0.02]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 p-2 rounded-xl">
                    <Sparkles className="h-5 w-5 text-[#ACBBC6]" />
                  </div>
                  <div>
                    <h3 className="font-black text-white">AI Copilot</h3>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
                      {chatLoading
                        ? '● Thinking...'
                        : dataLoading
                        ? '● Loading data...'
                        : `● ${datasets.length} datasets · ${insights.length} insights`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Language picker */}
                  <div className="relative">
                    <Globe className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-white/30 pointer-events-none" />
                    <select
                      value={lang}
                      onChange={e => setLang(e.target.value)}
                      className="bg-white/[0.05] border border-white/10 text-white/60 text-[11px] rounded-lg pl-6 pr-2 py-1.5 appearance-none focus:outline-none cursor-pointer"
                    >
                      {LANGUAGES.map(l => (
                        <option key={l.code} value={l.code}>
                          {l.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/5 rounded-xl transition-colors"
                  >
                    <X className="h-5 w-5 text-white/40" />
                  </button>
                </div>
              </div>

              {/* Dataset filter */}
              {datasets.length > 0 && (
                <div className="flex items-center gap-2">
                  <Database className="h-3.5 w-3.5 text-white/30 shrink-0" />
                  <select
                    value={selectedDs}
                    onChange={e => setSelectedDs(e.target.value)}
                    className="flex-1 bg-white/[0.04] border border-white/10 text-white/70 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#667D9D]/40 cursor-pointer appearance-none"
                  >
                    <option value="all">All datasets ({datasets.length})</option>
                    {datasets.map(ds => (
                      <option key={ds.id} value={ds.id}>
                        {ds.file_name} — {ds.row_count} rows
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* ── Stats bar ── */}
            {!dataLoading && datasets.length > 0 && (
              <div className="shrink-0 grid grid-cols-3 divide-x divide-white/[0.06] border-b border-[#ACBBC6]/10 bg-white/[0.01]">
                {[
                  { icon: Database,   label: 'Datasets', value: datasets.length },
                  { icon: TrendingUp, label: 'Insights',  value: insights.length },
                  {
                    icon: FileText,
                    label: 'Rows',
                    value: (
                      selectedDs === 'all'
                        ? datasets.reduce((s, d) => s + (d.row_count || 0), 0)
                        : datasets.find(d => d.id === selectedDs)?.row_count || 0
                    ).toLocaleString(),
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex flex-col items-center py-3 gap-0.5">
                    <Icon className="h-3.5 w-3.5 text-[#667D9D] mb-0.5" />
                    <span className="text-white font-black text-sm">{value}</span>
                    <span className="text-white/30 text-[9px] uppercase tracking-widest">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* ── Messages ── */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {dataLoading ? (
                <div className="space-y-3 animate-pulse">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className={`flex gap-2 ${i % 2 ? 'justify-end' : ''}`}>
                      <div
                        className={`h-14 rounded-2xl bg-white/5 ${
                          i % 2 ? 'w-3/4' : 'w-4/5'
                        }`}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex gap-2.5 ${
                        msg.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-1">
                          <Zap className="h-3 w-3 text-[#ACBBC6]" />
                        </div>
                      )}
                      <div
                        className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed rounded-2xl ${
                          msg.role === 'user'
                            ? 'bg-[#667D9D]/30 text-white border border-[#667D9D]/30 rounded-tr-sm'
                            : 'bg-white/[0.04] text-white/80 border border-white/6 rounded-tl-sm'
                        }`}
                      >
                        <div className="prose prose-invert prose-sm max-w-none">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      </div>
                      {msg.role === 'user' && (
                        <div className="w-7 h-7 rounded-full bg-[#667D9D]/40 flex items-center justify-center shrink-0 mt-1">
                          <span className="text-[10px] text-white font-black">
                            {user?.displayName?.[0]?.toUpperCase() || 'U'}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {chatLoading && (
                    <div className="flex gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <Zap className="h-3 w-3 text-[#ACBBC6]" />
                      </div>
                      <div className="bg-white/[0.04] border border-white/6 rounded-2xl rounded-tl-sm px-4 py-3">
                        <div className="flex gap-1 items-center">
                          {[0, 150, 300].map(delay => (
                            <span
                              key={delay}
                              className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce"
                              style={{ animationDelay: `${delay}ms` }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Suggestion chips — only at start */}
                  {messages.length <= 1 && !chatLoading && datasets.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <p className="text-[10px] font-black text-white/25 uppercase tracking-widest pl-1">
                        Try asking
                      </p>
                      {SUGGESTIONS.map(q => (
                        <button
                          key={q}
                          onClick={() => sendMessage(q)}
                          className="w-full text-left px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/6 hover:border-[#667D9D]/40 hover:bg-white/[0.06] transition-all text-xs text-white/45 font-medium"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}

                  <div ref={bottomRef} />
                </>
              )}
            </div>

            {/* ── Input ── */}
            <div className="shrink-0 p-4 border-t border-[#ACBBC6]/10 bg-white/[0.01]">
              <div className="relative">
                <textarea
                  rows={1}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  disabled={dataLoading || chatLoading}
                  placeholder={
                    dataLoading
                      ? 'Loading your data...'
                      : datasets.length === 0
                      ? 'Upload a dataset first...'
                      : 'Ask anything about your data...'
                  }
                  className="w-full bg-white/[0.04] border border-white/10 rounded-2xl pl-5 pr-14 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#667D9D]/40 focus:border-[#667D9D]/40 transition-all resize-none disabled:opacity-40"
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={chatLoading || dataLoading || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-[#667D9D] text-[#060817] rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none"
                >
                  {chatLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-[10px] text-white/20 text-center mt-3 uppercase tracking-[0.2em]">
                OpenRouter · Gemini 2.0 Flash · Enter to send
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AIInsightSidebar;