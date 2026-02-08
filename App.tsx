
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Type as TypeIcon, 
  Hash, 
  AlignLeft, 
  Clock, 
  Sparkles, 
  RefreshCw, 
  Trash2,
  Copy,
  Scissors,
  Check,
  Code,
  ShieldCheck,
  Bot,
  ChevronRight,
  ArrowUpRight,
  Maximize2,
  BarChart3,
  FileSearch,
  Zap,
  Moon,
  Sun,
  Layout,
  AlertTriangle,
  FileText,
  BarChart,
  Heart,
  X,
  Youtube,
  Gift,
  ExternalLink
} from 'lucide-react';
import { analyzeText, summarizeText, detectAI } from './services/geminiService';
import { TextStats, WordFrequency, AIAnalysis, AnalysisStatus, AIDetectionResult } from './types';
import StatsCard from './components/StatsCard';
import { WordFrequencyChart } from './components/Charts';

const App: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [summaryLimit, setSummaryLimit] = useState<number>(150);
  const [detection, setDetection] = useState<AIDetectionResult | null>(null);
  
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [summaryStatus, setSummaryStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [detectionStatus, setDetectionStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  
  const [copySuccess, setCopySuccess] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const stats = useMemo((): TextStats => {
    const trimmedText = text.trim();
    const words = trimmedText ? trimmedText.split(/\s+/).length : 0;
    const characters = text.length;
    const sentences = text.split(/[.!?]+/).filter(Boolean).length;
    const paragraphs = text.split(/\n+/).filter(Boolean).length;
    const readingTime = Math.ceil(words / 200) || 1;
    return { words, characters, sentences, paragraphs, readingTime };
  }, [text]);

  const wordFrequency = useMemo((): WordFrequency[] => {
    if (!text.trim()) return [];
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 2);
    
    const freq: Record<string, number> = {};
    words.forEach(w => freq[w] = (freq[w] || 0) + 1);
    
    return Object.entries(freq)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [text]);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setStatus(AnalysisStatus.LOADING);
    try {
      const result = await analyzeText(text);
      setAiAnalysis(result);
      setStatus(AnalysisStatus.SUCCESS);
    } catch (err) { setStatus(AnalysisStatus.ERROR); }
  };

  const handleSummarize = async () => {
    if (!text.trim()) return;
    setSummaryStatus(AnalysisStatus.LOADING);
    try {
      const result = await summarizeText(text, summaryLimit);
      setSummary(result);
      setSummaryStatus(AnalysisStatus.SUCCESS);
    } catch (err) { setSummaryStatus(AnalysisStatus.ERROR); }
  };

  const handleDetectAI = async () => {
    if (!text.trim()) return;
    setDetectionStatus(AnalysisStatus.LOADING);
    try {
      const result = await detectAI(text);
      setDetection(result);
      setDetectionStatus(AnalysisStatus.SUCCESS);
    } catch (err) { setDetectionStatus(AnalysisStatus.ERROR); }
  };

  const handleClear = () => {
    setText('');
    setAiAnalysis(null); setSummary(''); setDetection(null);
    setStatus(AnalysisStatus.IDLE); setSummaryStatus(AnalysisStatus.IDLE);
    setDetectionStatus(AnalysisStatus.IDLE);
  };

  const isTextEmpty = !text.trim();
  const disabledTitle = "Masukkan teks terlebih dahulu untuk mengaktifkan fitur ini";

  return (
    <div className="min-h-screen flex flex-col pb-12 transition-colors duration-500">
      {/* Donation & Support Modal */}
      {showDonationModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-2xl animate-in fade-in duration-300" onClick={() => setShowDonationModal(false)}></div>
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden reveal-card">
            <button 
              onClick={() => setShowDonationModal(false)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-rose-500 transition-colors z-10"
            >
              <X size={20} />
            </button>
            
            <div className="p-8 sm:p-12 space-y-10">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-rose-500 blur-3xl opacity-20 animate-pulse"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-br from-indigo-600 to-rose-600 rounded-[2.2rem] flex items-center justify-center text-white shadow-2xl shadow-rose-500/20">
                    <Sparkles size={42} className="animate-bounce-slow" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-black tracking-tighter dark:text-white">Support Our Mission</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-xs mx-auto">Donasi Anda menjaga LinguistAI tetap aktif dan gratis untuk komunitas.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a 
                    href="https://saweria.co/lordhaikal" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col gap-3 p-6 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-amber-400 hover:bg-amber-50/10 transition-all group"
                  >
                    <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center text-amber-600">
                      <Zap size={24} />
                    </div>
                    <div>
                      <p className="text-base font-black dark:text-white flex items-center gap-2">Saweria <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-all"/></p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Dukungan Lokal</p>
                    </div>
                  </a>

                  <a 
                    href="https://trakteer.id/muhamad_haikal33" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col gap-3 p-6 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-rose-400 hover:bg-rose-50/10 transition-all group"
                  >
                    <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/20 rounded-2xl flex items-center justify-center text-rose-600">
                      <Gift size={24} />
                    </div>
                    <div>
                      <p className="text-base font-black dark:text-white flex items-center gap-2">Trakteer <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-all"/></p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Traktir Jajan</p>
                    </div>
                  </a>
                </div>

                <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem]">
                   <a 
                    href="https://youtube.com/@lordhaikals" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-6 bg-white dark:bg-slate-900 rounded-[2.2rem] shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-rose-500/20 group"
                   >
                     <div className="flex items-center gap-5">
                       <div className="w-14 h-14 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-600/30 group-hover:scale-110 transition-transform">
                         <Youtube size={30} fill="white" />
                       </div>
                       <div>
                         <p className="text-lg font-black dark:text-white">Subscribe YouTube</p>
                         <p className="text-xs text-slate-500 font-medium">Ikuti tutorial & update terbaru</p>
                       </div>
                     </div>
                     <div className="px-5 py-2.5 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-rose-600/20 group-hover:bg-rose-700 transition-all">
                       Subscribe
                     </div>
                   </a>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Build with Passion by Lord Haikal</p>
                <div className="flex gap-1">
                  {[...Array(3)].map((_, i) => <div key={i} className="w-1 h-1 rounded-full bg-rose-500/40"></div>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Premium Sticky Header */}
      <header className="glass dark:bg-slate-900/90 border-b border-slate-200/60 dark:border-slate-800/60 sticky top-0 z-[100] py-3 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer min-w-0">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-indigo-600 blur-xl opacity-30 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-indigo-600 to-indigo-700 p-2.5 rounded-xl shadow-xl group-hover:rotate-6 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-black text-slate-900 dark:text-white tracking-tighter truncate">LinguistAI</h1>
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-[0.3em]">Pro v2.6.7</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={toggleTheme} className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-300 btn-premium hover:border-indigo-400 hover:text-indigo-600 shadow-sm active:scale-90 transition-all">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>
            <button 
              onClick={handleClear} 
              disabled={isTextEmpty} 
              className="p-2.5 rounded-xl border-2 transition-all btn-premium glow-rose active:scale-90"
              title={isTextEmpty ? disabledTitle : "Hapus draf"}
            >
              <Trash2 size={18} />
            </button>
            <button 
              onClick={handleAnalyze} 
              disabled={status === AnalysisStatus.LOADING || isTextEmpty} 
              className="px-5 py-2.5 bg-indigo-600 text-white font-black rounded-xl shadow-lg btn-premium glow-indigo flex items-center gap-2 justify-center transition-all"
              title={isTextEmpty ? disabledTitle : "Mulai Analisis"}
            >
              {status === AnalysisStatus.LOADING ? <RefreshCw className="w-4 h-4 animate-spin flex-shrink-0" /> : <Zap className="w-4 h-4 flex-shrink-0" />}
              <span className="hidden sm:inline tracking-widest uppercase text-[10px]">ANALISIS</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 sm:px-12 pt-8 space-y-8">
        {/* Statistics Bar */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
          <StatsCard label="Total Kata" value={stats.words} icon={<TypeIcon size={20}/>} color="bg-blue-600" />
          <StatsCard label="Karakter" value={stats.characters} icon={<Hash size={20}/>} color="bg-emerald-600" />
          <StatsCard label="Waktu Baca" value={`${stats.readingTime}m`} icon={<Clock size={20}/>} color="bg-violet-600" />
          <StatsCard label="Kalimat" value={stats.sentences} icon={<AlignLeft size={20}/>} color="bg-amber-600" />
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-8 space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl border border-slate-200/60 dark:border-slate-800/60 overflow-hidden relative group transition-all duration-500">
              <div className="absolute top-6 right-8 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <button 
                  onClick={() => { navigator.clipboard.writeText(text); alert('Teks disalin!'); }} 
                  disabled={isTextEmpty}
                  className="p-3 bg-white dark:bg-slate-800 shadow-lg border-2 border-slate-50 dark:border-slate-700 rounded-xl text-slate-400 hover:text-indigo-600 transition-all btn-premium active:scale-90"
                  title={isTextEmpty ? disabledTitle : "Salin Teks"}
                >
                  <Copy size={16} />
                </button>
              </div>
              <div className="px-8 pt-6 pb-4 border-b border-slate-50 dark:border-slate-800/40 flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Editor</span>
                 </div>
                 <div className="hidden sm:flex gap-4 text-[9px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5 hover:text-indigo-500 cursor-pointer transition-colors"><Maximize2 size={12}/> Focus</span>
                    <span className="flex items-center gap-1.5 hover:text-indigo-500 cursor-pointer transition-colors"><Layout size={12}/> Dashboard</span>
                 </div>
              </div>
              <textarea 
                className="w-full h-[320px] p-8 focus:outline-none text-lg text-slate-800 dark:text-slate-100 leading-relaxed resize-none placeholder:text-slate-200 dark:placeholder:text-slate-800 bg-transparent custom-scrollbar"
                placeholder="Tuliskan atau tempel teks Anda di sini untuk mulai menganalisis..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="px-8 py-5 bg-slate-50/80 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                 <div className="flex gap-8 w-full sm:w-auto">
                    <div className="flex flex-col">
                       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Paragraphs</span>
                       <span className="text-base font-black text-slate-700 dark:text-slate-300">{stats.paragraphs}</span>
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Readability</span>
                       <span className="text-base font-black text-slate-700 dark:text-slate-300">{stats.words > 0 ? (stats.words > 150 ? 'Medium' : 'Mudah') : '-'}</span>
                    </div>
                 </div>
                 <button 
                  onClick={handleAnalyze} 
                  disabled={isTextEmpty || status === AnalysisStatus.LOADING} 
                  className="w-full sm:w-auto px-8 py-3 bg-white dark:bg-slate-800 border-2 border-indigo-100 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-xl btn-premium glow-indigo hover:bg-indigo-600 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2"
                  title={isTextEmpty ? disabledTitle : "Jalankan Analisis"}
                 >
                    Jalankan Analisis <ChevronRight size={14} className="flex-shrink-0" />
                 </button>
              </div>
            </div>

            {/* AI Result View */}
            {status === AnalysisStatus.SUCCESS && aiAnalysis && (
              <div id="analysis-view" className="reveal-card bg-white dark:bg-slate-900 rounded-[2rem] border-2 border-slate-50 dark:border-slate-800 shadow-xl overflow-hidden">
                <div className="p-8 sm:p-10 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 text-white relative group">
                   <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12 group-hover:rotate-[25deg] transition-all duration-1000 scale-125">
                      <FileSearch size={140} />
                   </div>
                   <div className="relative z-10 space-y-2">
                      <div className="p-3 bg-white/20 rounded-xl w-fit backdrop-blur-md mb-2 group-hover:scale-110 transition-transform"><BarChart3 size={24} /></div>
                      <h2 className="text-2xl sm:text-3xl font-black tracking-tighter leading-tight">Laporan Insight AI</h2>
                      <p className="text-indigo-100 font-medium text-sm">Hasil analisis linguistik mendalam</p>
                   </div>
                </div>
                <div className="p-6 sm:p-10 space-y-10">
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                      {[
                        { label: 'Sentimen', val: aiAnalysis.sentiment, color: 'bg-indigo-50/50 dark:bg-indigo-900/10', text: 'text-indigo-900 dark:text-indigo-200' },
                        { label: 'Nada', val: aiAnalysis.tone, color: 'bg-violet-50/50 dark:bg-violet-900/10', text: 'text-violet-900 dark:text-violet-200' },
                        { label: 'Kompleksitas', val: aiAnalysis.complexity, color: 'bg-amber-50/50 dark:bg-amber-900/10', text: 'text-amber-900 dark:text-amber-200' },
                      ].map((item, i) => (
                        <div key={i} className={`${item.color} p-5 rounded-[1.5rem] border border-white/5 group/card hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all flex flex-col justify-center min-h-[110px] text-center sm:text-left`}>
                           <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">{item.label}</p>
                           <p className={`text-sm sm:text-base font-bold ${item.text} leading-tight break-words`}>
                             {item.val}
                           </p>
                        </div>
                      ))}
                   </div>

                   <div className="space-y-4">
                      <h3 className="font-black text-lg flex items-center gap-2"><BarChart size={18} className="text-indigo-500 flex-shrink-0"/> Frekuensi Kata Teratas</h3>
                      <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-[1.5rem] border border-slate-100 dark:border-slate-800">
                         <WordFrequencyChart data={wordFrequency} />
                         <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-4 text-center">Statistik penggunaan kata unik dalam teks</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-4">
                         <h3 className="font-black text-lg flex items-center gap-2"><FileText size={18} className="text-indigo-500 flex-shrink-0"/> Ringkasan</h3>
                         <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all">
                            <p className="text-slate-600 dark:text-slate-300 italic text-sm font-medium leading-relaxed">"{aiAnalysis.summary}"</p>
                            <div className="mt-4 flex flex-wrap gap-1.5">
                               {aiAnalysis.keywords.map((k, idx) => (
                                 <span key={idx} className="px-3 py-1 bg-white dark:bg-slate-900 rounded-lg text-[9px] font-black text-slate-400 uppercase border border-slate-100 dark:border-slate-800 shadow-xs">#{k}</span>
                               ))}
                            </div>
                         </div>
                      </div>
                      <div className="space-y-4">
                         <h3 className="font-black text-lg flex items-center gap-2"><BarChart3 size={18} className="text-emerald-500 flex-shrink-0"/> Struktur Kalimat</h3>
                         <div className="space-y-6 px-1">
                            {[
                              { label: 'Kata Benda (Nouns)', val: aiAnalysis.partsOfSpeech.nouns, color: 'bg-indigo-500', icon: 'N' },
                              { label: 'Kata Kerja (Verbs)', val: aiAnalysis.partsOfSpeech.verbs, color: 'bg-emerald-500', icon: 'V' },
                              { label: 'Kata Sifat (Adjectives)', val: aiAnalysis.partsOfSpeech.adjectives, color: 'bg-amber-500', icon: 'A' },
                            ].map((item, idx) => (
                              <div key={idx} className="space-y-2 group/bar">
                                 <div className="flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-wider">
                                    <span className="flex items-center gap-2">
                                       <span className={`w-5 h-5 rounded-md ${item.color} text-white flex items-center justify-center text-[10px] flex-shrink-0`}>{item.icon}</span> {item.label}
                                    </span>
                                    <span className="text-slate-900 dark:text-white font-bold">{item.val}</span>
                                 </div>
                                 <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className={`${item.color} h-full rounded-full transition-all duration-1000`} style={{ width: `${Math.min(100, item.val * 4)}%` }} />
                                 </div>
                              </div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            )}
          </div>

          <div className="xl:col-span-4 space-y-8">
            {/* AI Guard */}
            <div className={`bg-white dark:bg-slate-900 rounded-[2rem] border-2 transition-all duration-500 p-6 sm:p-8 shadow-lg relative overflow-hidden group/guard ${detection ? (detection.isLikelyAI ? 'border-amber-400/50' : 'border-emerald-400/50') : 'border-slate-50 dark:border-slate-800'}`}>
              <div className="flex items-center justify-between mb-8 relative z-10">
                 <div className="space-y-0.5 min-w-0">
                    <h3 className="font-black text-[9px] uppercase tracking-widest text-slate-400">Security</h3>
                    <p className="font-black text-xl text-slate-800 dark:text-white truncate">AI Guard</p>
                 </div>
                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${detection ? (detection.isLikelyAI ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600') : 'bg-slate-50 dark:bg-slate-800 text-slate-300'}`}>
                    {detection && detection.isLikelyAI ? <AlertTriangle size={20} /> : <ShieldCheck size={20} />}
                 </div>
              </div>

              {!detection ? (
                <div className="space-y-6 relative z-10">
                   <p className="text-[12px] text-slate-500 font-medium leading-snug">Verifikasi integritas tulisan dengan deteksi cerdas LinguistAI.</p>
                   <button 
                     onClick={handleDetectAI} 
                     disabled={detectionStatus === AnalysisStatus.LOADING || isTextEmpty} 
                     className="w-full h-14 bg-slate-900 dark:bg-indigo-600 text-white font-black rounded-xl btn-premium glow-indigo text-[10px] uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-3 px-4"
                     title={isTextEmpty ? disabledTitle : "Cek Keaslian"}
                   >
                      <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                        {detectionStatus === AnalysisStatus.LOADING ? <RefreshCw className="animate-spin" size={18} /> : <Bot size={18} />}
                      </div>
                      <span className="truncate">CHECK INTEGRITY</span>
                   </button>
                </div>
              ) : (
                <div className="reveal-card space-y-6 relative z-10">
                   <div className={`p-6 rounded-[1.5rem] flex flex-col items-center gap-4 border transition-all ${detection.isLikelyAI ? 'bg-amber-50/50 dark:bg-amber-950/10 border-amber-100' : 'bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-100'}`}>
                      <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
                         <svg className="w-full h-full -rotate-90">
                            <circle cx="40" cy="40" r="34" fill="none" stroke={theme === 'dark' ? "#1e293b" : "#e2e8f0"} strokeWidth="6" />
                            <circle cx="40" cy="40" r="34" fill="none" stroke={detection.isLikelyAI ? "#f59e0b" : "#10b981"} strokeWidth="6" strokeDasharray={213} strokeDashoffset={213 - (213 * detection.aiProbability) / 100} strokeLinecap="round" className="transition-all duration-1000" />
                         </svg>
                         <div className="absolute flex flex-col items-center">
                            <span className="text-lg font-black">{Math.round(detection.aiProbability)}%</span>
                            <span className="text-[7px] font-black uppercase text-slate-400">Skor AI</span>
                         </div>
                      </div>
                      <div className="text-center min-w-0 w-full">
                         <p className={`text-[10px] font-black uppercase tracking-wider mb-1 ${detection.isLikelyAI ? 'text-amber-600' : 'text-emerald-600'}`}>
                            {detection.isLikelyAI ? 'Terdeteksi AI' : 'Penulisan Manusia'}
                         </p>
                         <p className="text-[9px] text-slate-400 font-bold max-w-full mx-auto leading-tight break-words px-2">"{detection.reasoning}"</p>
                      </div>
                   </div>
                   <button onClick={() => setDetection(null)} className="w-full text-[9px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-all py-2 border-t border-slate-50 dark:border-slate-800/50 mt-2">
                      Ulangi Deteksi
                   </button>
                </div>
              )}
            </div>

            {/* AI Summarizer */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border-2 border-slate-50 dark:border-slate-800 p-6 sm:p-8 shadow-sm group/summarizer">
               <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl flex items-center justify-center text-indigo-600 flex-shrink-0"><Scissors size={20} /></div>
                  <h3 className="font-black text-xl dark:text-white truncate">Ringkasan Otomatis</h3>
               </div>
               <div className="space-y-8">
                  <div className="space-y-4">
                     <div className="flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        <span>Limit Karakter</span>
                        <span className="text-indigo-600 font-bold">{summaryLimit}</span>
                     </div>
                     <input type="range" min="50" max="500" step="50" value={summaryLimit} onChange={(e) => setSummaryLimit(parseInt(e.target.value))} className="w-full accent-indigo-600 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full cursor-pointer" />
                  </div>
                  <button 
                    onClick={handleSummarize} 
                    disabled={summaryStatus === AnalysisStatus.LOADING || isTextEmpty} 
                    className="w-full h-12 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-black rounded-xl btn-premium glow-indigo hover:bg-indigo-600 hover:text-white text-[10px] uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-3 px-4"
                    title={isTextEmpty ? disabledTitle : "Buat Ringkasan"}
                  >
                     {summaryStatus === AnalysisStatus.LOADING ? <RefreshCw className="animate-spin flex-shrink-0" size={16} /> : <Zap className="flex-shrink-0" size={16} />}
                     BUAT RINGKASAN
                  </button>
                  {summary && (
                    <div className="reveal-card p-6 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] relative group/sum-res mt-4">
                       <p className="text-[12px] text-slate-600 dark:text-slate-400 font-bold italic leading-relaxed break-words pr-8">"{summary}"</p>
                       <button onClick={() => { navigator.clipboard.writeText(summary); setCopySuccess(true); setTimeout(()=>setCopySuccess(false), 2000); }} className="absolute top-4 right-4 text-slate-300 hover:text-indigo-600 flex-shrink-0 transition-colors">
                          {copySuccess ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                       </button>
                    </div>
                  )}
               </div>
            </div>

            {/* YouTube Subscription Card */}
            <div className="bg-rose-600/5 dark:bg-rose-600/[0.03] rounded-[2rem] border-2 border-rose-100 dark:border-rose-900/30 p-6 sm:p-8 space-y-4 shadow-sm group/youtube transition-all hover:shadow-lg">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center text-white flex-shrink-0 group-hover:rotate-12 transition-transform shadow-lg shadow-rose-600/20">
                    <Youtube size={20} fill="currentColor" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-sm dark:text-white truncate">YouTube Community</h3>
                    <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wider">Join 10K+ Subscribers</p>
                  </div>
               </div>
               <p className="text-[12px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  Pelajari tips linguistik AI dan update fitur LinguistAI secara visual di channel kami.
               </p>
               <a 
                  href="https://youtube.com/@lordhaikals"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-white dark:bg-slate-800 border-2 border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 text-[9px] font-black uppercase tracking-widest rounded-xl btn-premium glow-rose flex items-center justify-center gap-2 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
               >
                  Subscribe Now <Youtube size={14} fill="currentColor" className="flex-shrink-0" />
               </a>
            </div>

            {/* Donation Card */}
            <div className="bg-gradient-to-br from-indigo-600/10 to-rose-600/10 dark:from-indigo-600/5 dark:to-rose-600/5 rounded-[2rem] border-2 border-indigo-100/50 dark:border-indigo-900/30 p-6 sm:p-8 space-y-4 shadow-sm group/donation transition-all hover:shadow-lg">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-rose-100 dark:bg-rose-950/30 rounded-xl flex items-center justify-center text-rose-600 flex-shrink-0 animate-pulse-fast">
                    <Heart size={20} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-sm dark:text-white truncate">Dukung Kreator</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Membantu LinguistAI Tetap Gratis</p>
                  </div>
               </div>
               <p className="text-[12px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  Bantu kami meningkatkan server dan kualitas AI kami.
               </p>
               <button 
                  onClick={() => setShowDonationModal(true)}
                  className="w-full py-3 bg-white dark:bg-slate-800 border-2 border-indigo-100 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[9px] font-black uppercase tracking-widest rounded-xl btn-premium glow-indigo flex items-center justify-center gap-2 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
               >
                  Donasi & Support <Heart size={14} fill="currentColor" className="flex-shrink-0" />
               </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border-2 border-slate-50 dark:border-slate-800 p-6 sm:p-8 flex items-center justify-between group/dev shadow-sm hover:shadow-md transition-all">
               <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/20 rounded-xl flex items-center justify-center text-indigo-600 flex-shrink-0 transition-transform group-hover:scale-110"><Code size={24} /></div>
                  <div className="min-w-0">
                     <h4 className="text-[9px] font-black uppercase text-slate-400 tracking-widest truncate">Dikembangkan oleh</h4>
                     <p className="text-lg font-black text-slate-800 dark:text-white group-hover:text-indigo-600 transition-colors truncate">Muhamad Haikal</p>
                  </div>
               </div>
               <a href="https://www.instagram.com/lordhaikals" target="_blank" rel="noopener noreferrer" className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-300 hover:text-white hover:bg-indigo-600 transition-all shadow-sm active:scale-90 flex-shrink-0">
                  <ArrowUpRight size={20} />
               </a>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto w-full px-6 sm:px-12 py-12 border-t border-slate-200/60 dark:border-slate-800/60 mt-12">
         <div className="flex flex-col sm:row items-center justify-between gap-8">
            <div className="flex items-center gap-4 flex-shrink-0">
               <div className="w-10 h-10 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center shadow-lg flex-shrink-0 transition-transform hover:rotate-12"><Sparkles size={18} className="text-white dark:text-slate-900" /></div>
               <span className="font-black text-xl tracking-tighter">LinguistAI</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6">
               <a href="https://youtube.com/@lordhaikals" target="_blank" rel="noopener noreferrer" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors flex items-center gap-2">
                 YouTube <Youtube size={14} />
               </a>
               <button onClick={() => setShowDonationModal(true)} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-500 transition-colors flex items-center gap-2">
                 Dukung Kami <Heart size={14} />
               </button>
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-center sm:text-right">
                  Build 2.6.7 Stable • 2024 LinguistAI
               </p>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default App;
