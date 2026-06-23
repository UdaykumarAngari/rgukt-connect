import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, ShieldCheck, MoreHorizontal, Loader2, Share2, X } from 'lucide-react';
import axios from 'axios';
import { mockUsers } from '../data/users';

// Sub-component to recursively render comment items and their nested replies
const CommentItem = ({ comment, session, onLikeComment, onAddReply }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  // Mentions autocomplete within replies
  const [showReplySuggestions, setShowReplySuggestions] = useState(false);
  const [filteredReplySuggestions, setFilteredReplySuggestions] = useState([]);

  const handleReplyChange = (e) => {
    const val = e.target.value;
    setReplyContent(val);
    
    const lastWord = val.split(/\s+/).pop();
    if (lastWord && lastWord.startsWith('@')) {
      const query = lastWord.slice(1).toLowerCase();
      const filtered = mockUsers.filter(u => 
        u.name.toLowerCase().includes(query)
      );
      setFilteredReplySuggestions(filtered);
      setShowReplySuggestions(filtered.length > 0);
    } else {
      setShowReplySuggestions(false);
    }
  };

  const handleSelectReplySuggestion = (username) => {
    const words = replyContent.split(/\s+/);
    words.pop();
    const updatedText = [...words, `@${username} `].join(' ');
    setReplyContent(updatedText);
    setShowReplySuggestions(false);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    setSubmittingReply(true);
    try {
      const res = await axios.post(`/api/posts/${comment.postId}/comments`, {
        content: replyContent,
        parentCommentId: comment.id
      }, {
        headers: { Authorization: `Bearer ${session.token}` }
      });
      onAddReply(comment.id, res.data);
      setReplyContent('');
      setShowReplyForm(false);
    } catch (err) {
      console.error('Error replying to comment:', err);
    } finally {
      setSubmittingReply(false);
    }
  };

  const renderContent = (text) => {
    if (!text) return '';
    const parts = text.split(/(\s+)/);
    return parts.map((part, index) => {
      if (part.startsWith('@') && part.length > 1) {
        return <span key={index} className="text-rgukt-maroon font-bold hover:underline cursor-pointer">{part}</span>;
      }
      return part;
    });
  };

  return (
    <div className="mt-4 first:mt-0">
      <div className="flex gap-3 items-start">
        <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0 overflow-hidden mt-0.5">
          {comment.authorAvatar ? (
            <img src={comment.authorAvatar} alt={comment.author} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-rgukt-maroon/5 text-rgukt-maroon font-bold text-xs">
              {comment.author ? comment.author[0] : 'U'}
            </div>
          )}
        </div>
        <div className="flex-1 bg-slate-50/70 rounded-2xl px-4 py-2.5 border border-slate-100/50">
          <div className="flex justify-between items-start">
            <div>
              <h5 className="font-bold text-charcoal text-[11px] leading-none">{comment.author}</h5>
              <p className="text-[9px] text-slate-400 mt-1">{comment.authorTitle}</p>
            </div>
            <span className="text-[9px] text-slate-400">{comment.timestamp}</span>
          </div>
          <p className="text-slate-700 text-xs mt-2 leading-relaxed">{renderContent(comment.content)}</p>

          <div className="flex items-center gap-4 mt-2 pt-1 border-t border-slate-100/30">
            <button 
              onClick={() => onLikeComment(comment.id)}
              className={`flex items-center gap-1 text-[9px] font-bold transition-colors cursor-pointer ${
                comment.likedByMe ? 'text-rgukt-maroon' : 'text-slate-400 hover:text-rgukt-maroon'
              }`}
            >
              <Heart size={10} className={comment.likedByMe ? 'fill-rgukt-maroon text-rgukt-maroon' : ''} />
              <span>{comment.likes > 0 ? comment.likes : 'Like'}</span>
            </button>
            <button 
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-slate-400 hover:text-rgukt-maroon text-[9px] font-bold cursor-pointer"
            >
              Reply
            </button>
          </div>
        </div>
      </div>

      {showReplyForm && (
        <form onSubmit={handleReplySubmit} className="ml-11 mt-2 relative flex gap-2">
          <input 
            type="text" 
            placeholder={`Reply to ${comment.author}...`}
            value={replyContent}
            onChange={handleReplyChange}
            disabled={submittingReply}
            className="flex-1 bg-white border border-slate-150 text-xs rounded-xl px-3 py-1.5 outline-none focus:border-slate-300"
          />
          <button 
            type="submit" 
            disabled={submittingReply || !replyContent.trim()}
            className="bg-rgukt-maroon text-white text-[10px] font-bold px-3 py-1.5 rounded-xl cursor-pointer hover:opacity-90 disabled:opacity-50"
          >
            Reply
          </button>

          {/* Reply autocomplete suggestions */}
          {showReplySuggestions && (
            <div className="absolute bottom-full mb-1 left-0 w-56 bg-white border border-slate-100 rounded-xl shadow-lg z-30 max-h-32 overflow-y-auto py-1">
              {filteredReplySuggestions.map(u => (
                <button 
                  key={u.id}
                  type="button"
                  onClick={() => handleSelectReplySuggestion(u.name.replace(/\s+/g, ''))}
                  className="w-full text-left px-3 py-1.5 text-[10px] text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-semibold"
                >
                  {u.name}
                </button>
              ))}
            </div>
          )}
        </form>
      )}

      {/* Hierarchical Sub-replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-8 border-l border-slate-100 pl-3 mt-2 space-y-2">
          {comment.replies.map(reply => (
            <CommentItem 
              key={reply.id} 
              comment={reply} 
              session={session} 
              onLikeComment={onLikeComment} 
              onAddReply={onAddReply} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

const PostCard = ({ post, session, onLikeToggle, onDelete }) => {
  const { 
    id, authorId, author, authorTitle, authorAvatar, authorBio, timestamp, content, type, 
    codeSnippet, company, role, isVerified, likes, likedByMe, comments, mediaUrl
  } = post;

  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  // Comments states
  const [showComments, setShowComments] = useState(false);
  const [commentsList, setCommentsList] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  
  // Mentions inside comments list
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  // In-app share modal states
  const [showInAppModal, setShowInAppModal] = useState(false);
  const [connections, setConnections] = useState([]);
  const [connectionsLoading, setConnectionsLoading] = useState(false);
  const [sentStatus, setSentStatus] = useState({});

  // 1. Like toggle
  const handleLike = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await axios.post(`/api/posts/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${session?.token}` }
      });
      if (onLikeToggle) {
        onLikeToggle(res.data);
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Delete post
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${session?.token}` }
      });
      if (onDelete) {
        onDelete(id);
      }
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Failed to delete post.');
    } finally {
      setShowMenu(false);
    }
  };

  // 3. Comments load
  const loadComments = async () => {
    setCommentsLoading(true);
    try {
      const res = await axios.get(`/api/posts/${id}/comments`, {
        headers: { Authorization: `Bearer ${session?.token}` }
      });
      setCommentsList(res.data);
    } catch (err) {
      console.error('Error loading comments:', err);
    } finally {
      setCommentsLoading(false);
    }
  };

  const toggleCommentsView = () => {
    const nextState = !showComments;
    setShowComments(nextState);
    if (nextState) {
      loadComments();
    }
  };

  // 4. Create top-level comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;
    try {
      const res = await axios.post(`/api/posts/${id}/comments`, {
        content: commentContent
      }, {
        headers: { Authorization: `Bearer ${session?.token}` }
      });
      setCommentsList(prev => [...prev, res.data]);
      setCommentContent('');
      if (onLikeToggle) {
        onLikeToggle({ ...post, comments: comments + 1 });
      }
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  // 5. Autocomplete suggestions handler
  const handleCommentChange = (e) => {
    const val = e.target.value;
    setCommentContent(val);
    
    const lastWord = val.split(/\s+/).pop();
    if (lastWord && lastWord.startsWith('@')) {
      const query = lastWord.slice(1).toLowerCase();
      const filtered = mockUsers.filter(u => 
        u.name.toLowerCase().includes(query)
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (username) => {
    const words = commentContent.split(/\s+/);
    words.pop();
    const updatedText = [...words, `@${username} `].join(' ');
    setCommentContent(updatedText);
    setShowSuggestions(false);
  };

  // 6. Comment likes toggle
  const handleLikeComment = async (commentId) => {
    try {
      const res = await axios.post(`/api/comments/${commentId}/like`, {}, {
        headers: { Authorization: `Bearer ${session?.token}` }
      });
      
      const updateLikesRecursively = (comments) => {
        return comments.map(c => {
          if (c.id === commentId) {
            return { ...c, likes: res.data.likes, likedByMe: res.data.likedByMe };
          }
          if (c.replies && c.replies.length > 0) {
            return { ...c, replies: updateLikesRecursively(c.replies) };
          }
          return c;
        });
      };
      setCommentsList(prev => updateLikesRecursively(prev));
    } catch (err) {
      console.error('Error liking comment:', err);
    }
  };

  // 7. Add nested reply to memory state
  const handleAddReply = (parentCommentId, newReply) => {
    const addReplyRecursively = (comments) => {
      return comments.map(c => {
        if (c.id === parentCommentId) {
          return { ...c, replies: [...(c.replies || []), newReply] };
        }
        if (c.replies && c.replies.length > 0) {
          return { ...c, replies: addReplyRecursively(c.replies) };
        }
        return c;
      });
    };
    setCommentsList(prev => addReplyRecursively(prev));
    if (onLikeToggle) {
      onLikeToggle({ ...post, comments: comments + 1 });
    }
  };

  // 8. Sharing Handlers
  const shareOnWhatsApp = () => {
    const postUrl = `${window.location.origin}/post/${id}`;
    const text = encodeURIComponent(`Check out this post by ${author} on RGUKT Connect: "${content.substring(0, 100)}..." \n\nRead more at ${postUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    setShowShareMenu(false);
  };

  const copyPostLink = () => {
    const postUrl = `${window.location.origin}/post/${id}`;
    navigator.clipboard.writeText(postUrl);
    alert("Post link copied to clipboard!");
    setShowShareMenu(false);
  };

  const handleInAppShareOpen = async () => {
    setShowShareMenu(false);
    setShowInAppModal(true);
    setConnectionsLoading(true);
    try {
      const res = await axios.get(`/api/connections/list/${session.id}`, {
        headers: { Authorization: `Bearer ${session.token}` }
      });
      setConnections(res.data);
    } catch (err) {
      console.error('Error fetching connections:', err);
    } finally {
      setConnectionsLoading(false);
    }
  };

  const handleSendInApp = async (connectionId, connectionName) => {
    const postUrl = `${window.location.origin}/post/${id}`;
    const messageContent = `Check out this post on RGUKT Connect by ${author}: "${content.substring(0, 50)}..." \nLink: ${postUrl}`;
    
    try {
      await axios.post('/api/chat/send', {
        receiverId: connectionId,
        content: messageContent
      }, {
        headers: { Authorization: `Bearer ${session.token}` }
      });
      setSentStatus(prev => ({ ...prev, [connectionId]: true }));
    } catch (err) {
      console.error('Failed to send in-app message:', err);
      alert('Failed to send message.');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-visible mb-6 relative">
      {/* 1. HEADER: Author Info */}
      <div className="p-5 flex justify-between items-start">
        <div className="flex gap-3">
          <div className="w-11 h-11 rounded-full bg-slate-200 shrink-0 overflow-hidden">
            {authorAvatar ? (
              <img src={authorAvatar} alt={author} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-rgukt-maroon/5 text-rgukt-maroon font-bold">
                {author ? author[0] : 'U'}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-charcoal leading-none">{author}</h4>
              {isVerified && <ShieldCheck size={16} className="text-rgukt-gold fill-rgukt-gold/10" />}
            </div>
            {authorBio && <p className="text-[11px] text-slate-400 mt-1 max-w-[320px] line-clamp-1">{authorBio}</p>}
            <p className="text-[10px] text-slate-500 mt-1">{authorTitle} • {timestamp}</p>
          </div>
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="text-slate-400 hover:text-charcoal p-1 cursor-pointer rounded-full hover:bg-slate-50 transition-colors"
          >
            <MoreHorizontal size={20} />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-1 w-40 bg-white border border-slate-100 rounded-2xl shadow-xl z-20 py-1.5">
              {session?.id === authorId ? (
                <button 
                  onClick={handleDelete}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-semibold cursor-pointer transition-colors"
                >
                  Delete Post
                </button>
              ) : (
                <button 
                  onClick={() => {
                    alert("Reported successfully!");
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  Report Post
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 2. BODY: Content */}
      <div className="px-5 pb-4">
        <p className="text-slate-800 text-[15px] leading-relaxed mb-4">{content}</p>

        {/* Media Attachments */}
        {mediaUrl && (
          <div className="rounded-2xl overflow-hidden border border-slate-100 mb-4 max-h-[360px] flex justify-center bg-slate-50">
            <img src={mediaUrl} alt="Post Attachment" className="w-full h-auto object-cover max-h-[360px]" />
          </div>
        )}

        {/* TYPE: CODE SNIPPET */}
        {type === 'code' && (
          <div className="bg-[#1e1e1e] rounded-2xl p-5 font-mono text-[13px] text-slate-300 overflow-x-auto border border-slate-800 shadow-inner">
            <pre className="whitespace-pre">
              <code>{codeSnippet}</code>
            </pre>
          </div>
        )}

        {/* TYPE: JOB REFERRAL */}
        {type === 'referral' && (
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full">
              <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center font-bold text-rgukt-maroon shrink-0">
                {company ? company[0] : 'J'}
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

      {/* 3. FOOTER: Actions */}
      <div className="px-5 py-3 border-t border-slate-50 flex items-center gap-8">
        <button 
          onClick={handleLike}
          disabled={loading}
          className={`flex items-center gap-2 text-sm font-medium cursor-pointer transition-all duration-200 hover:scale-105 disabled:opacity-50 ${
            likedByMe 
              ? 'text-rgukt-maroon' 
              : 'text-slate-500 hover:text-rgukt-maroon'
          }`}
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Heart 
              size={18} 
              className={likedByMe ? 'fill-rgukt-maroon text-rgukt-maroon' : 'hover:fill-rgukt-maroon/10'} 
            />
          )}
          <span>{likes > 0 ? `${likes} ${likes === 1 ? 'Like' : 'Likes'}` : 'Like'}</span>
        </button>

        <button 
          onClick={toggleCommentsView}
          className="flex items-center gap-2 text-slate-500 hover:text-rgukt-maroon text-sm cursor-pointer transition-colors font-medium"
        >
          <MessageCircle size={18} /> 
          <span>{comments > 0 ? `${comments} ${comments === 1 ? 'Comment' : 'Comments'}` : 'Comment'}</span>
        </button>

        {/* Share Dropdown Button */}
        <div className="relative">
          <button 
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="flex items-center gap-2 text-slate-500 hover:text-rgukt-maroon text-sm cursor-pointer transition-colors font-medium"
          >
            <Share2 size={18} /> 
            <span>Share</span>
          </button>
          {showShareMenu && (
            <div className="absolute left-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl z-20 py-2 space-y-0.5 animate-in fade-in slide-in-from-top-2 duration-150">
              <button 
                onClick={shareOnWhatsApp}
                className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-bold"
              >
                <span>💬</span> Share on WhatsApp
              </button>
              <button 
                onClick={handleInAppShareOpen}
                className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-bold"
              >
                <span>✉️</span> In-App Message
              </button>
              <button 
                onClick={copyPostLink}
                className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-bold"
              >
                <span>🔗</span> Copy Link
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4. EXPANDABLE COMMENTS PANEL */}
      {showComments && (
        <div className="px-5 py-4 bg-slate-50/40 border-t border-slate-100">
          <div className="space-y-4">
            {commentsLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="animate-spin text-rgukt-maroon" size={20} />
              </div>
            ) : commentsList.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-2">No comments yet. Be the first to share your thoughts!</p>
            ) : (
              commentsList.map(comment => (
                <CommentItem 
                  key={comment.id} 
                  comment={comment} 
                  session={session} 
                  onLikeComment={handleLikeComment} 
                  onAddReply={handleAddReply} 
                />
              ))
            )}
          </div>

          {/* New Comment Input Field */}
          <form onSubmit={handleCommentSubmit} className="mt-4 pt-3 border-t border-slate-100">
            <div className="relative flex gap-2">
              <input 
                type="text" 
                placeholder="Write a comment... (Type @ to mention)" 
                value={commentContent}
                onChange={handleCommentChange}
                className="flex-1 bg-white border border-slate-200 text-xs rounded-xl px-4 py-2.5 outline-none focus:border-slate-350"
              />
              <button 
                type="submit" 
                disabled={!commentContent.trim()}
                className="bg-rgukt-maroon text-white font-bold px-5 py-2 rounded-xl cursor-pointer hover:opacity-90 disabled:opacity-50 text-xs"
              >
                Comment
              </button>

              {/* Autocomplete suggestion popup */}
              {showSuggestions && (
                <div className="absolute bottom-full mb-2 left-0 w-64 bg-white border border-slate-150 rounded-2xl shadow-2xl z-30 max-h-40 overflow-y-auto py-1">
                  {filteredSuggestions.map(u => (
                    <button 
                      key={u.id}
                      type="button"
                      onClick={() => handleSelectSuggestion(u.name.replace(/\s+/g, ''))}
                      className="w-full text-left px-3 py-2 text-[11px] text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-bold"
                    >
                      <div className="w-5 h-5 rounded-full bg-slate-200 shrink-0 overflow-hidden flex items-center justify-center text-[10px] font-bold text-rgukt-maroon">
                        {u.name[0]}
                      </div>
                      <div>
                        <div>{u.name}</div>
                        <div className="text-[9px] text-slate-400 font-normal">{u.role}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Connection Picker Share Modal */}
      {showInAppModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-charcoal/20 backdrop-blur-[2px]">
          <div className="bg-white w-full max-w-sm rounded-[32px] shadow-2xl flex flex-col max-h-[50vh] overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center px-5 py-4 border-b border-slate-100">
              <h4 className="font-bold text-charcoal text-sm">Send In-App Message</h4>
              <button 
                onClick={() => setShowInAppModal(false)}
                className="p-1.5 hover:bg-slate-50 rounded-full cursor-pointer"
              >
                <X size={16} className="text-slate-400" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {connectionsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="animate-spin text-rgukt-maroon" size={24} />
                </div>
              ) : connections.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs italic">
                  No active connections found to message.
                </div>
              ) : (
                connections.map(conn => (
                  <div key={conn.id} className="flex justify-between items-center p-2 rounded-2xl hover:bg-slate-50 transition-colors">
                    <div className="flex gap-2 items-center">
                      <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center text-xs font-bold text-rgukt-maroon">
                        {conn.profilePhoto ? (
                          <img src={conn.profilePhoto} alt={conn.name} className="w-full h-full object-cover" />
                        ) : (
                          conn.name ? conn.name[0] : 'U'
                        )}
                      </div>
                      <span className="text-xs font-bold text-charcoal">{conn.name}</span>
                    </div>
                    <button
                      onClick={() => handleSendInApp(conn.id, conn.name)}
                      disabled={sentStatus[conn.id]}
                      className={`text-[10px] font-bold px-3 py-1.5 rounded-xl cursor-pointer transition-colors ${
                        sentStatus[conn.id]
                          ? 'bg-emerald-50 text-emerald-600 cursor-default'
                          : 'bg-slate-100 hover:bg-rgukt-maroon hover:text-white text-slate-700'
                      }`}
                    >
                      {sentStatus[conn.id] ? 'Sent' : 'Send'}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;