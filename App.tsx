
import React, { useState, useEffect } from 'react';
import { generateScript } from './services/geminiService';
import { Script } from './types';
import ScriptView from './components/ScriptView';

declare var html2pdf: any; // External library from script tag

const App: React.FC = () => {
  const [concept, setConcept] = useState('');
  const [loading, setLoading] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [script, setScript] = useState<Script | null>(null);
  const [error, setError] = useState('');
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingMessages = [
    "মাস্টার লেভেল স্টোরি থিঙ্কিং চলছে...",
    "সংলাপগুলো গ্রামীন ধাঁচে প্রফেশনালি লেখা হচ্ছে...",
    "৩-৪ পৃষ্ঠার নিখুঁত চিত্রনাট্য তৈরি হচ্ছে...",
    "তুষারের সংলাপগুলো ছোট করা হচ্ছে...",
    "ন্যাচারাল স্ক্রিপ্ট রাইটিং মাস্টার মুড সক্রিয়..."
  ];

  const trendingTopics = [
    "সালামের আধুনিক কৃষি বিপ্লব ও তুষির সমর্থন",
    "তুষারের কৌতুক ও শাহাদাতের গম্ভীর সংগ্রাম",
    "গ্রামের প্রথম ফ্রিল্যান্সার যখন সালাম",
    "তুষি যখন গ্রামের প্রধান সমস্যা সমাধানে সাহসী",
    "শাহাদাত ও সালামের বন্ধুত্বে তুষারের কান্ড"
  ];

  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
      }, 3000);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleGenerate = async (customConcept?: string) => {
    const finalConcept = customConcept || concept;
    if (!finalConcept.trim()) {
      setError('একটি কনসেপ্ট দিন অথবা ম্যাজিক বাটন চাপুন');
      return;
    }
    setLoading(true);
    setError('');
    setScript(null);
    try {
      const result = await generateScript(finalConcept);
      setScript(result);
    } catch (err) {
      setError('স্ক্রিপ্ট তৈরি করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMagicScript = () => {
    const randomTopic = trendingTopics[Math.floor(Math.random() * trendingTopics.length)];
    setConcept(randomTopic);
    handleGenerate(randomTopic);
  };

  // TXT ডাউনলোড ফাংশন
  const downloadTxt = () => {
    if (!script) return;
    let text = `MasterScript Gen | ${script.title}\nরচনায়: Md A Salam With MasterScript Gen\n\n`;
    text += `চরিত্র পরিচিতি:\n`;
    script.characters.forEach(c => {
      text += `${c.name} (${c.age} বছর): ${c.description}. কস্টিউম: ${c.costume}\n`;
    });
    text += `\nকাহিনী সংক্ষেপ: ${script.summary}\n\n`;
    text += `\nমূল চিত্রনাট্য:\n`;
    script.scenes.forEach(s => {
      text += `\nদৃশ্য - ${s.sceneNumber}: ${s.location} [${s.time}]\n`;
      text += `অ্যাকশন: ${s.action}\n`;
      s.dialogues.forEach(d => {
        text += `${d.character}: ${d.parenthetical ? '(' + d.parenthetical + ') ' : ''}${d.text}\n`;
      });
      if (s.editingNote) text += `নোট: ${s.editingNote}\n`;
      text += `--------------------------------\n`;
    });
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${script.title}_MasterScript.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // প্রো-লেভেল পিডিএফ জেনারেশন ইঞ্জিন
  const generatePDF = async () => {
    if (!script) return;
    
    setPdfGenerating(true);
    const element = document.getElementById('script-content');
    if (!element) return;

    const opt = {
      margin: [15, 15, 15, 15],
      filename: `${script.title}_MasterScript.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true,
        backgroundColor: '#ffffff'
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    try {
      element.classList.add('pdf-export-mode');
      await html2pdf().set(opt).from(element).save();
      element.classList.remove('pdf-export-mode');
    } catch (err) {
      console.error("PDF Export Error:", err);
      alert("পিডিএফ তৈরিতে সমস্যা হয়েছে।");
    } finally {
      setPdfGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-50 px-6 py-4 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 print-hidden shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500 rounded-xl shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-black font-serif-title tracking-tight text-emerald-400">MasterScript Gen</h1>
              <p className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60">Creative | Professional | Natural writer</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {script && (
              <div className="flex gap-2">
                <button 
                  onClick={downloadTxt} 
                  className="bg-slate-800 text-slate-100 px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-500 hover:text-white transition-all active:scale-95 border border-slate-700"
                >
                  Download TXT
                </button>
                <button 
                  onClick={generatePDF} 
                  disabled={pdfGenerating}
                  className={`bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl text-xs font-black uppercase shadow-lg shadow-emerald-600/20 transition-all active:scale-95 flex items-center gap-2 ${pdfGenerating ? 'opacity-70 animate-pulse' : ''}`}
                >
                  {pdfGenerating ? 'পিডিএফ তৈরি হচ্ছে...' : 'Download PDF'}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto mt-12 px-4 pb-20">
        <div className="premium-card bg-slate-900/50 p-10 rounded-[2.5rem] shadow-2xl print-hidden mb-12 border border-slate-800">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">চিত্রনাট্য প্যানেল</h2>
            <p className="opacity-60 text-sm"> Md A Salam-এর জন্য প্রফেশনাল গ্রামীণ নাটকের মাস্টার স্ক্রিপ্ট</p>
          </div>
          
          <textarea
            className="w-full p-6 bg-slate-800/50 border-2 border-slate-800 rounded-2xl focus:outline-none focus:border-emerald-500 transition-all text-xl font-medium mb-8 min-h-[150px] resize-none text-slate-100 placeholder:opacity-30"
            placeholder="আপনার নাটকের মূল কাহিনী বা ভাবনাটি এখানে লিখুন..."
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
          />

          <div className="flex flex-col md:flex-row gap-5">
            <button
              onClick={() => handleGenerate()}
              disabled={loading}
              className={`flex-[2] py-5 rounded-2xl font-black text-white uppercase tracking-[0.2em] transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 ${
                loading ? 'bg-slate-700 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-xl'
              }`}
            >
              {loading ? loadingMessages[loadingStep] : 'মাস্টার স্ক্রিপ্ট জেনারেট করুন'}
            </button>

            <button
              onClick={handleMagicScript}
              disabled={loading}
              className="flex-1 py-5 rounded-2xl font-black text-white uppercase bg-indigo-600 hover:bg-indigo-700 shadow-xl flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]"
            >
              ম্যাজিক অটো স্ক্রিপ্ট
            </button>
          </div>
          
          {error && <p className="mt-6 text-red-400 font-bold text-center bg-red-900/20 p-3 rounded-lg border border-red-800/30">{error}</p>}
        </div>

        {script ? (
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-1000">
            <div id="script-content">
               <ScriptView script={script} />
            </div>
          </div>
        ) : !loading && (
          <div className="text-center py-32 opacity-20">
            <svg className="w-24 h-24 mx-auto mb-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path></svg>
            <p className="text-3xl font-black uppercase tracking-widest italic text-slate-100">Ready to Create</p>
          </div>
        )}
      </main>

      <footer className="py-12 border-t border-slate-800 text-center print-hidden opacity-50">
        <p className="font-bold uppercase tracking-[0.5em] text-[10px] text-slate-100">© ২০২৪ Md A Salam - MasterScript Gen</p>
      </footer>
    </div>
  );
};

export default App;
