
import React from 'react';
import { Script } from '../types';

interface ScriptViewProps {
  script: Script;
}

const ScriptView: React.FC<ScriptViewProps> = ({ script }) => {
  return (
    <div className="script-container bg-white dark:bg-slate-900 shadow-2xl rounded-[2.5rem] p-12 max-w-5xl mx-auto my-8 border border-slate-200 dark:border-slate-800 transition-colors duration-500 overflow-hidden">
      {/* Cover Page */}
      <div className="text-center min-h-[85vh] flex flex-col justify-center border-b-8 border-double border-slate-800 dark:border-slate-700 mb-16 page-break">
        <h1 className="text-6xl font-black font-serif-title text-slate-900 dark:text-white mb-8 uppercase tracking-tight leading-tight">{script.title}</h1>
        <div className="w-32 h-2 bg-emerald-500 mx-auto mb-10 rounded-full print:bg-black"></div>
        <p className="text-2xl text-slate-400 italic mb-20">প্রফেশনাল গ্রামীণ চিত্রনাট্য ও সংলাপ</p>
        
        <div className="space-y-4 mb-24">
          <p className="text-sm text-slate-400 font-black uppercase tracking-[0.5em]">কাহিনী ও চিত্রনাট্য</p>
          <p className="text-4xl font-black text-emerald-600 dark:text-emerald-400 print:text-black">Md A Salam With MasterScript Gen</p>
        </div>
        
        <div className="mt-20 border-t border-slate-100 dark:border-slate-800 pt-10">
          <p className="text-[10px] text-slate-400 uppercase tracking-[1em] font-black">MasterScript Premium Copy</p>
        </div>
      </div>

      {/* Summary Section */}
      <section className="mb-24 page-break px-4">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 border-b-4 border-emerald-500 inline-block px-2 print:border-black">কাহিনী সংক্ষেপ</h2>
        <p className="text-xl text-slate-700 dark:text-slate-300 leading-relaxed text-justify first-letter:text-5xl first-letter:font-black first-letter:mr-2 first-letter:text-emerald-500 print:first-letter:text-black">
          {script.summary}
        </p>
      </section>

      {/* Character List */}
      <section className="mb-24 page-break px-4">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-10 border-b-4 border-emerald-500 inline-block px-2 print:border-black">চরিত্র পরিচিতি</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {script.characters.map((char, idx) => (
            <div key={idx} className="bg-slate-50 dark:bg-slate-800/30 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 group print:bg-white print:border-black">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">{char.name}</h3>
                <span className="text-xs font-bold text-slate-400 bg-white dark:bg-slate-800 px-3 py-1 rounded-full print:border print:border-black">{char.age} বছর</span>
              </div>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">{char.description}</p>
              <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 print:bg-white print:border-black">
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold italic print:text-black">সাজসজ্জা: {char.costume}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Screenplay Content */}
      <section className="px-4">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-16 border-b-4 border-emerald-500 inline-block px-2 print:border-black">মূল চিত্রনাট্য</h2>
        
        {script.scenes.map((scene) => (
          <div key={scene.sceneNumber} className="mb-24 page-break last:mb-0">
            {/* Scene Header */}
            <div className="bg-slate-900 dark:bg-slate-800 text-white p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center mb-10 shadow-xl gap-4 print:bg-white print:text-black print:border-2 print:border-black">
              <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                <span className="bg-emerald-500 text-white px-3 py-1 rounded-lg text-xs print:bg-black print:text-white">SCENE {scene.sceneNumber}</span>
                {scene.location}
              </h3>
              <span className="text-xs font-black bg-white/10 px-4 py-2 rounded-full uppercase tracking-widest print:text-black">
                {scene.time}
              </span>
            </div>
            
            {/* Scene Action */}
            <div className="action-lines mb-12">
              <p className="text-xl text-slate-700 dark:text-slate-400 leading-relaxed italic border-l-4 border-emerald-500 pl-8 py-3 bg-slate-50/50 dark:bg-slate-800/20 rounded-r-2xl print:border-black print:bg-white">
                ( {scene.action} )
              </p>
            </div>
            
            {/* Dialogues */}
            <div className="space-y-10 mb-10">
              {scene.dialogues.map((dlg, dIdx) => (
                <div key={dIdx} className="max-w-xl mx-auto text-center">
                  <p className="font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] text-sm mb-2">{dlg.character}</p>
                  {dlg.parenthetical && (
                    <p className="italic text-xs text-slate-400 dark:text-slate-500 mb-2">
                      ({dlg.parenthetical})
                    </p>
                  )}
                  <p className="text-2xl leading-relaxed text-slate-800 dark:text-slate-300 font-medium print:text-black">
                    {dlg.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Editing Notes */}
            {scene.editingNote && (
              <div className="mt-16 p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-3xl text-sm print:bg-white print:border-black">
                <span className="font-black text-emerald-600 dark:text-emerald-400 uppercase text-[10px] tracking-widest block mb-3 print:text-black">PRODUCTION NOTES</span>
                <p className="leading-relaxed opacity-70 italic print:text-black">{scene.editingNote}</p>
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Footer */}
      <div className="mt-40 py-24 text-center border-t border-slate-100 dark:border-slate-800 print:border-black">
        <p className="text-slate-300 dark:text-slate-700 font-serif-title tracking-[1em] uppercase text-2xl print:text-black">THE END</p>
        <p className="mt-6 text-[10px] text-slate-400 font-black uppercase tracking-widest print:text-black">Md A Salam With MasterScript Gen © {new Date().getFullYear()}</p>
      </div>
    </div>
  );
};

export default ScriptView;
