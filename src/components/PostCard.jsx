import React from 'react';
import { Heart, MessageCircle, ShieldCheck, MoreHorizontal } from 'lucide-react';

const PostCard = ({ post }) => {
  const { 
    author, authorTitle, timestamp, content, type, 
    codeSnippet, company, role, isVerified 
  } = post;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-6">
      {/* 1. HEADER: Author Info */}
      <div className="p-5 flex justify-between items-start">
        <div className="flex gap-3">
          <div className="w-11 h-11 rounded-full bg-slate-200 shrink-0 overflow-hidden">
             <div className="w-full h-full flex items-center justify-center bg-rgukt-maroon/5 text-rgukt-maroon font-bold">
               {author[0]}
             </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-charcoal leading-none">{author}</h4>
              {isVerified && <ShieldCheck size={16} className="text-rgukt-gold fill-rgukt-gold/10" />}
            </div>
            <p className="text-[12px] text-slate-500 mt-1">{authorTitle} • {timestamp}</p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-charcoal p-1 cursor-pointer">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* 2. BODY: Content rendering based on "type" */}
      <div className="px-5 pb-4">
        <p className="text-slate-800 text-[15px] leading-relaxed mb-4">{content}</p>

        {/* TYPE: CODE SNIPPET */}
        {type === 'code' && (
          <div className="bg-[#1e1e1e] rounded-2xl p-5 font-mono text-[13px] text-slate-300 overflow-x-auto border border-slate-800 shadow-inner">
            <pre className="whitespace-pre">
              <code>{codeSnippet}</code>
            </pre>
          </div>
        )}

        {/* TYPE: JOB REFERRAL - Fixed layout to prevent overlap */}
        {type === 'referral' && (
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full">
              <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center font-bold text-rgukt-maroon shrink-0">
                {company[0]}
              </div>
              <div className="min-w-0">
                <h5 className="font-bold text-charcoal truncate">Job Referral</h5>
                <p className="text-sm text-slate-500 truncate">{role} at {company}</p>
              </div>
            </div>
            <button className="bg-rgukt-maroon text-white px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap hover:scale-105 transition-transform w-full md:w-auto cursor-pointer">
              Ask for Referral
            </button>
          </div>
        )}
      </div>

      {/* 3. FOOTER: Social Actions (LinkedIn Button Removed) */}
      <div className="px-5 py-3 border-t border-slate-50 flex items-center gap-8">
        <button className="flex items-center gap-2 text-slate-500 hover:text-rgukt-maroon text-sm group cursor-pointer transition-colors font-medium">
          <Heart size={18} className="group-hover:fill-rgukt-maroon/10" /> 
          <span>Like</span>
        </button>
        <button className="flex items-center gap-2 text-slate-500 hover:text-rgukt-maroon text-sm cursor-pointer transition-colors font-medium">
          <MessageCircle size={18} /> 
          <span>Comment</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;