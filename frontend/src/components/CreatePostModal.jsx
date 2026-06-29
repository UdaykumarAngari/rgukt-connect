import React, { useState, useRef } from 'react';
import { X, Code, Image as ImageIcon, Loader2 } from 'lucide-react';
import axios from 'axios';

const CreatePostModal = ({ isOpen, onClose, onSubmit, session }) => {

  const [postType, setPostType] = useState('text');
  const [content, setContent] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
 
  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setSelectedMedia(URL.createObjectURL(file));
    }
  };

  const handlePostSubmit = async () => {
    if (!content.trim() && !selectedFile) return;

    setLoading(true);
    try {
      let uploadedMediaUrl = null;

      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        const mediaRes = await axios.post('/api/posts/media', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${session?.token}`
          }
        });
        uploadedMediaUrl = mediaRes.data.mediaUrl;
      }

      const res = await axios.post('/api/posts', {
        type: postType,
        content: content,
        codeSnippet: postType === 'code' ? codeSnippet : null,
        mediaUrl: uploadedMediaUrl
      }, {
        headers: {
          Authorization: `Bearer ${session?.token}`
        }
      });

      onSubmit(res.data);

      setContent('');
      setCodeSnippet('');
      setSelectedMedia(null);
      setSelectedFile(null);
      setPostType('text');
    } catch (err) {
      console.error('Error creating post:', err);
      alert(err.response?.data?.error || 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 bg-charcoal/20 backdrop-blur-[2px]">
      
      <div className="mt-20 bg-white w-full max-w-lg rounded-[32px] shadow-2xl flex flex-col max-h-[65vh] overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
       
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 shrink-0 bg-white">
          <h3 className="font-bold text-charcoal text-lg">Create Post</h3>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
          >
            <X size={18} className="text-slate-400" />
          </button>
        </div>
 
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
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              disabled={loading}
              className="w-full h-40 bg-[#1e1e1e] text-slate-300 font-mono text-xs rounded-2xl p-4 outline-none border border-slate-800"
            />
          )}
        </div>
 
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*,video/*" 
                className="hidden" 
                disabled={loading}
              />
              
              <button 
                onClick={() => fileInputRef.current.click()} 
                disabled={loading}
                className="p-2.5 text-slate-500 hover:text-rgukt-maroon hover:bg-white rounded-xl transition-all cursor-pointer disabled:opacity-50"
              >
                <ImageIcon size={20} />
              </button>
              
              <button 
                onClick={() => setPostType(postType === 'code' ? 'text' : 'code')} 
                disabled={loading}
                className={`p-2.5 rounded-xl cursor-pointer transition-all disabled:opacity-50 ${
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
              disabled={loading || (!content.trim() && !selectedFile)}
              className="bg-rgukt-maroon text-white px-8 py-2.5 rounded-xl font-bold hover:opacity-90 shadow-md transition-all cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Posting...</span>
                </>
              ) : (
                <span>Post</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;