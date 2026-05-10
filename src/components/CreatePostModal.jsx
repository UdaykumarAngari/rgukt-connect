import React, { useState, useRef } from 'react';
import { X, Code, Image as ImageIcon, Video, Link, AtSign } from 'lucide-react';

const CreatePostModal = ({ isOpen, onClose, onSubmit }) => {
  // 1. STATE MANAGEMENT
  const [postType, setPostType] = useState('text');
  const [content, setContent] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const fileInputRef = useRef(null);

  // 2. LOGIC HANDLERS
  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a temporary local URL for the preview
      setSelectedMedia(URL.createObjectURL(file));
    }
  };

  const handlePostSubmit = () => {
    if (!content.trim() && !selectedMedia) return;

    // Construct the mock post object
    const newPost = {
      id: Date.now(),
      author: "Udaykumar Angari",
      authorTitle: "CSE | Batch 2026",
      timestamp: "Just now",
      isVerified: false,
      type: postType,
      content: content,
      mediaUrl: selectedMedia, // In production, this will be the S3 URL
      mediaType: selectedMedia ? 'image' : 'text',
      likes: 0,
      comments: 0
    };

    onSubmit(newPost);
    
    // Reset state for next time
    setContent('');
    setSelectedMedia(null);
    setPostType('text');
  };

  return (
    /* OUTER OVERLAY: items-start + mt-20 ensures we don't cover the FloatingDock */
    <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 bg-charcoal/20 backdrop-blur-[2px]">
      
      {/* MODAL CONTAINER: max-h-[65vh] keeps it short and professional */}
      <div className="mt-20 bg-white w-full max-w-lg rounded-[32px] shadow-2xl flex flex-col max-h-[65vh] overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
        
        {/* A. HEADER (Pinned) */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 shrink-0 bg-white">
          <h3 className="font-bold text-charcoal text-lg">Create Post</h3>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
          >
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        {/* B. SCROLLABLE CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <textarea 
            placeholder="What's on your mind, Udaykumar?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[100px] bg-transparent border-none text-charcoal text-lg placeholder:text-slate-400 outline-none resize-none"
          />

          {selectedMedia && (
            <div className="relative rounded-2xl overflow-hidden border border-slate-100">
              <button 
                onClick={() => setSelectedMedia(null)}
                className="absolute top-2 right-2 p-1.5 bg-charcoal/60 text-white rounded-full z-10 backdrop-blur-md"
              >
                <X size={14} />
              </button>
              <img src={selectedMedia} alt="Preview" className="w-full h-auto object-cover" />
            </div>
          )}

          {postType === 'code' && (
            <textarea 
              placeholder="Paste your code snippet here..."
              className="w-full h-40 bg-[#1e1e1e] text-slate-300 font-mono text-xs rounded-2xl p-4 outline-none border border-slate-800"
            />
          )}
        </div>

        {/* C. FOOTER (Pinned at the bottom of the modal) */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*,video/*" 
                className="hidden" 
              />
              
              <button 
                onClick={() => fileInputRef.current.click()} 
                className="p-2.5 text-slate-500 hover:text-rgukt-maroon hover:bg-white rounded-xl transition-all cursor-pointer"
              >
                <ImageIcon size={20} />
              </button>
              
              <button 
                onClick={() => setPostType(postType === 'code' ? 'text' : 'code')} 
                className={`p-2.5 rounded-xl cursor-pointer transition-all ${
                  postType === 'code' 
                  ? 'bg-rgukt-maroon text-white shadow-sm' 
                  : 'text-slate-500 hover:text-rgukt-maroon hover:bg-white'
                }`}
              >
                <Code size={20} />
              </button>
            </div>

            <button 
              onClick={handlePostSubmit}
              className="bg-rgukt-maroon text-white px-8 py-2.5 rounded-xl font-bold hover:opacity-90 shadow-md transition-all cursor-pointer active:scale-95"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;