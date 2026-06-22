// app/messages/component/MessagesPageClient.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Send, Trash2, ArrowLeft } from 'lucide-react';
import Avatar from '@/app/MainPage/trendingThreads/components/Avatar';
import { MessageService } from '@/app/services/messages';
import { ConversationPreview, Conversation, MessageUser } from '../types';
import { useSnapshot } from 'valtio';
import { store } from '@/app/store';

export default function MessagesPageClient({ activeId }: { activeId?: string }) {
  const router = useRouter();
  const snap = useSnapshot(store);
  const myId = snap._id;

  const [conversations, setConversations] = useState<ConversationPreview[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [active, setActive] = useState<Conversation | null>(null);
  const [loadingThread, setLoadingThread] = useState(false);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    MessageService.listConversations()
      .then(res => setConversations(res.data.conversations ?? []))
      .catch(err => console.log('Failed to load conversations', err))
      .finally(() => setLoadingList(false));
  }, []);

  useEffect(() => {
    if (!activeId) { setActive(null); return; }
    setLoadingThread(true);
    MessageService.getConversation(activeId)
      .then(res => {
        setActive(res.data.conversation);
        setConversations(prev => prev.map(c => c._id === activeId ? { ...c, unread: false } : c));
      })
      .catch(err => console.log('Failed to load conversation', err))
      .finally(() => setLoadingThread(false));
  }, [activeId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [active?.messages.length]);

  const handleSend = async () => {
    const content = draft.trim();
    if (!content || !activeId) return;
    setSending(true);
    setDraft('');
    try {
      const res = await MessageService.send({ conversationId: activeId, content });
      setActive(prev => prev ? { ...prev, messages: [...prev.messages, res.data.message] } : prev);
      if (!myId) return;
      setConversations(prev =>
        prev.map(c => c._id === activeId ? { ...c, lastMessage: { content, sender: myId, createdAt: new Date().toISOString() }, lastMessageAt: new Date().toISOString() } : c)
          .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime())
      );
    } catch (err) {
      console.log('Failed to send message', err);
      setDraft(content);
    } finally {
      setSending(false);
    }
  };

  const handleDeleteConversation = async (id: string) => {
    try {
      await MessageService.deleteConversation(id);
      setConversations(prev => prev.filter(c => c._id !== id));
      if (activeId === id) router.push('/messages');
    } catch (err) { console.log('Failed to delete conversation', err); }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!activeId) return;
    setActive(prev => prev ? { ...prev, messages: prev.messages.filter(m => m._id !== messageId) } : prev);
    try { await MessageService.deleteMessage(activeId, messageId); }
    catch (err) { console.log('Failed to delete message', err); }
  };

  const activeOther: MessageUser | undefined = active?.participants.find(p => p._id !== myId);

  return (
    <div className="min-h-screen bg-[#1b1c1f]">
         <div className=' max-w-5xl cursor-pointer  mx-auto pt-5'>
          <div onClick={()=>router.back()} >
          <ArrowLeft />
          </div>
        </div>
      <div className="max-w-5xl mx-auto px-4 py-6 flex gap-5">
        
        <aside className="w-64 shrink-0">
          <div className="bg-[#242528] border border-[rgba(255,255,255,0.06)] rounded-xl overflow-hidden">
            <div className="px-3.5 py-3 border-b border-[rgba(255,255,255,0.06)] flex items-center gap-2">
              <Mail size={18} className="text-[#4b8ef1]" />
              <span className="text-base font-bold text-[#e4e6eb]">Messages</span>
            </div>
            <div className="max-h-[70vh] overflow-y-auto divide-y divide-[rgba(255,255,255,0.04)]">
              {loadingList ? (
                <div className="p-4 text-center text-[13px] text-[#b1b2b8]">Loading…</div>
              ) : conversations.length === 0 ? (
                <div className="p-4 text-center font-medium text-[14px] text-[#b9bbc5]">No conversations yet.</div>
              ) : (
                conversations.map(c => (
                  <button key={c._id} onClick={() => router.push(`/messages/${c._id}`)}
                    className={`w-full flex cursor-pointer items-center gap-2.5 px-3 py-2.5 text-left transition-colors
                      ${c._id === activeId ? 'bg-[#4b8ef1]/10' : c.unread ? 'bg-[#1e2535] hover:bg-[#212840]' : 'hover:bg-[#1b1c1f]'}`}>
                    <Avatar name={c.otherUser?.username ?? '?'} src={c.otherUser?.avatar} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${c.unread ? 'text-[#e4e6eb]' : 'text-[#dbdcdd]'}`}>{c.otherUser?.username ?? 'Unknown user'}</p>
                      <p className="text-[13px] text-[#a3a4a7] truncate">{c.lastMessage?.content ?? ''}</p>
                    </div>
                    {c.unread && <div className="w-1.5 h-1.5 rounded-full bg-[#4b8ef1] shrink-0" />}
                  </button>
                ))
              )}
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0 bg-[#242528] border border-[rgba(255,255,255,0.06)] rounded-xl flex flex-col" style={{ height: '70vh' }}>
          {!activeId || !active ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
              <Mail size={28} className="text-[#a5a7ad] mb-3" />
              <p className="text-base font-semibold text-[#8a8d91]">{loadingThread ? 'Loading…' : 'Select a conversation'}</p>
              <p className="text-sm text-[#a6a8b1] mt-1">Pick someone from the list to see your messages.</p>
            </div>
          ) : (
            <>
              <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.06)] flex items-center gap-2.5">
                <Avatar name={activeOther?.username ?? '?'} src={activeOther?.avatar} size="md" />
                <span className="text-base font-semibold text-[#e4e6eb]">{activeOther?.username ?? 'Unknown user'}</span>
                <button onClick={() => handleDeleteConversation(active._id)}
                  className="ml-auto w-7 h-7 flex items-center justify-center rounded hover:bg-[#ef4444]/10 text-[#a3a4ac] hover:text-[#ef4444] transition-colors" title="Delete conversation">
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
                {active.messages.map(m => {
                  const senderId = typeof m.sender === 'string' ? m.sender : m.sender._id;
                  const isMine = senderId === myId;
                  return (
                    <div key={m._id} className={`flex group ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex items-end gap-1.5 max-w-[75%] ${isMine ? 'flex-row-reverse' : ''}`}>
                        <div className={`px-3 py-2 rounded-2xl text-sm leading-snug ${isMine ? 'bg-[#4b8ef1] text-white rounded-br-sm' : 'bg-[#1b1c1f] text-[#e4e6eb] rounded-bl-sm'}`}>
                          {m.content}
                        </div>
                        {isMine && (
                          <button onClick={() => handleDeleteMessage(m._id)}
                            className="opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center text-[#4a4b50] hover:text-[#ef4444] transition-opacity" title="Delete message">
                            <Trash2 size={11} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              <div className="px-3 py-3 border-t border-[rgba(255,255,255,0.06)] flex items-center gap-2">
                <input
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Type a message…"
                  className="flex-1 bg-[#1b1c1f] border border-[rgba(255,255,255,0.08)] rounded-lg px-3.5 py-2 text-sm text-[#e4e6eb] placeholder:text-[#c8c9ce] outline-none focus:border-[#4b8ef1] transition-colors"
                />
                <button onClick={handleSend} disabled={sending || !draft.trim()}
                  className="w-8 h-8 flex items-center justify-center rounded-full opacity-100 bg-[#4b8ef1] cursor-pointer text-white disabled:opacity-50 hover:bg-[#3a7de0] transition-colors shrink-0">
                  
                   {sending 
                    ? <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /></>
                    : <Send size={14} />
                  }
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}