import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send,
  Search,
  MessageCircle,
  Phone,
  Video,
  Info,
  CheckCheck,
  Circle,
  Clock,
  BookOpen,
  Mail,
  MapPin,
  CheckCircle2,
  PhoneCall,
  VideoOff
} from 'lucide-react';
import { Chat, Message, UserProfile } from '../types';

interface MessagesProps {
  chats: Chat[];
  messages: Message[];
  user: UserProfile;
  selectedChatId: string | null;
  setSelectedChatId: (id: string | null) => void;
  onSendMessage: (chatId: string, content: string) => void;
  onReceiveMessage: (chatId: string, content: string, senderName: string, senderAvatar: string) => void;
}

export default function Messages({
  chats,
  messages,
  user,
  selectedChatId,
  setSelectedChatId,
  onSendMessage,
  onReceiveMessage
}: MessagesProps) {
  const [typedMessage, setTypedMessage] = useState('');
  const [chatSearch, setChatSearch] = useState('');
  const [showProfileSidebar, setShowProfileSidebar] = useState(true);
  const [callNotification, setCallNotification] = useState<string | null>(null);

  const messageEndRef = useRef<HTMLDivElement>(null);

  // Default to first chat if none selected
  useEffect(() => {
    if (!selectedChatId && chats.length > 0) {
      setSelectedChatId(chats[0].id);
    }
  }, [selectedChatId, chats, setSelectedChatId]);

  // Scroll to bottom of chat
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedChatId]);

  const activeChat = chats.find(c => c.id === selectedChatId) || chats[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeChat) return;

    // Send the user message
    onSendMessage(activeChat.id, typedMessage);
    const sentText = typedMessage;
    setTypedMessage('');

    // Trigger mock response after 1.5 seconds! Makes the system extremely interactive
    setTimeout(() => {
      let replyText = 'Understood! I will look into this and get back to you shortly.';
      if (activeChat.type === 'faculty') {
        replyText = `Thank you Alex, I received your query about ML layers. Let's discuss this further in my office tomorrow.`;
      } else if (activeChat.type === 'group') {
        replyText = `Sophia: I think we have that written down in the shared labs directory, check there!`;
      } else {
        replyText = `Hey Alex, sounds good! See you at the student study center later.`;
      }

      onReceiveMessage(
        activeChat.id,
        replyText,
        activeChat.name,
        activeChat.avatar
      );
    }, 1500);
  };

  const triggerCallSim = (type: 'voice' | 'video') => {
    setCallNotification(`Placing simulated ${type} call to ${activeChat?.name}...`);
    setTimeout(() => {
      setCallNotification(null);
    }, 4000);
  };

  // Filter chats by search
  const filteredChats = chats.filter((c) =>
    c.name.toLowerCase().includes(chatSearch.toLowerCase()) ||
    (c.lastMessage && c.lastMessage.toLowerCase().includes(chatSearch.toLowerCase()))
  );

  // Active chat messages
  const activeChatMessages = messages.filter(m => m.chatId === activeChat?.id);

  return (
    <div className="h-[calc(100vh-8.5rem)] flex bg-bg-surface dark:bg-[#111827] border border-border-custom dark:border-gray-800 rounded-custom-lg overflow-hidden shadow-custom-card relative">
      
      {/* 1. Chats List Sidebar */}
      <div className="w-full md:w-80 border-r border-border-custom dark:border-gray-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Header & Search */}
          <div className="p-4 border-b border-border-custom dark:border-gray-800 space-y-3.5 bg-bg-primary dark:bg-gray-855/10">
            <h2 className="font-display font-bold text-lg text-text-primary dark:text-gray-200">
              Messages
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-text-muted" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={chatSearch}
                onChange={(e) => setChatSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-bg-surface dark:bg-[#111827] border border-border-custom dark:border-gray-800 rounded-custom-md focus:outline-none focus:ring-2 focus:ring-brand-primary/25 transition-all font-sans text-text-primary"
              />
            </div>
          </div>

          {/* List items */}
          <div className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-19rem)]">
            {filteredChats.map((chat) => {
              const isActive = selectedChatId === chat.id;
              return (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChatId(chat.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-custom-md transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-brand-light dark:bg-blue-950/30'
                      : 'hover:bg-bg-primary/50 dark:hover:bg-gray-850/40'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={chat.avatar}
                      alt={chat.name}
                      referrerPolicy="no-referrer"
                      className="h-10 w-10 rounded-full object-cover border border-border-custom dark:border-gray-800"
                    />
                    {chat.online && (
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-success border-2 border-bg-surface dark:border-gray-900"></span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-xs font-bold truncate ${isActive ? 'text-brand-primary' : 'text-text-primary'}`}>
                        {chat.name}
                      </h4>
                      <span className="text-[8px] text-text-muted font-mono">
                        {chat.lastMessageTime}
                      </span>
                    </div>
                    <p className="text-[10px] text-text-muted dark:text-gray-500 truncate mt-0.5 font-sans leading-normal">
                      {chat.lastMessage}
                    </p>
                  </div>

                  {chat.unreadCount > 0 && (
                    <span className="h-5 min-w-5 flex items-center justify-center rounded-full bg-brand-primary text-[9px] font-bold text-white px-1 font-sans shrink-0">
                      {chat.unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Small informational bottom rail */}
        <div className="p-3 border-t border-border-custom dark:border-gray-800 text-[10px] text-center text-text-muted font-sans font-medium bg-bg-primary dark:bg-gray-855/5">
          💬 Live Academic Sync Active
        </div>
      </div>

      {/* 2. Active Chat Conversation Window */}
      {activeChat ? (
        <div className="flex-1 flex flex-col justify-between bg-bg-primary/20 dark:bg-[#0b0f19]/20 relative">
          
          {/* Incoming Call Notification PopUp */}
          <AnimatePresence>
            {callNotification && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-text-primary text-white text-xs px-4 py-3 rounded-custom-lg shadow-custom-modal flex items-center gap-3 border border-white/10"
              >
                <div className="h-2 w-2 rounded-full bg-success animate-ping" />
                <span className="font-medium font-sans">{callNotification}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Chat Header */}
          <div className="h-16 border-b border-border-custom dark:border-gray-800 px-4 flex items-center justify-between bg-bg-surface dark:bg-[#111827] shrink-0">
            <div className="flex items-center gap-3">
              <img
                src={activeChat.avatar}
                alt={activeChat.name}
                referrerPolicy="no-referrer"
                className="h-10 w-10 rounded-full object-cover border border-border-custom"
              />
              <div>
                <h3 className="text-sm font-bold text-text-primary dark:text-gray-200 leading-tight font-display">
                  {activeChat.name}
                </h3>
                <p className="text-[9px] text-text-muted font-sans mt-0.5 flex items-center gap-1 leading-none">
                  <span className={`h-1.5 w-1.5 rounded-full ${activeChat.online ? 'bg-success' : 'bg-text-muted'}`}></span>
                  {activeChat.online ? 'Online' : 'Away'} {activeChat.role && `• ${activeChat.role}`}
                </p>
              </div>
            </div>

            {/* Quick buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => triggerCallSim('voice')}
                className="p-2 text-text-muted hover:text-brand-primary rounded-custom-md hover:bg-bg-primary dark:hover:bg-gray-850 cursor-pointer transition-colors"
                title="Voice Call"
              >
                <Phone className="h-4.5 w-4.5" />
              </button>
              <button
                onClick={() => triggerCallSim('video')}
                className="p-2 text-text-muted hover:text-brand-primary rounded-custom-md hover:bg-bg-primary dark:hover:bg-gray-855 cursor-pointer transition-colors"
                title="Video Call"
              >
                <Video className="h-4.5 w-4.5" />
              </button>
              <button
                onClick={() => setShowProfileSidebar(!showProfileSidebar)}
                className={`p-2 rounded-custom-md cursor-pointer transition-colors ${
                  showProfileSidebar
                    ? 'text-brand-primary bg-brand-light dark:text-blue-400 dark:bg-indigo-950/30 font-bold'
                    : 'text-text-muted hover:text-brand-primary hover:bg-bg-primary dark:hover:bg-gray-850'
                }`}
                title="Toggle details"
              >
                <Info className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>

          {/* Conversation messages timeline */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeChatMessages.map((msg) => {
              const isMe = msg.senderId === 'alex-rivera';
              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 max-w-[80%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  {/* Sender Avatar */}
                  {!isMe && (
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      referrerPolicy="no-referrer"
                      className="h-7 w-7 rounded-full object-cover shrink-0 border border-border-custom"
                    />
                  )}
                  <div className="space-y-1">
                    <div
                      className={`p-3 rounded-custom-md text-xs md:text-sm leading-relaxed font-sans ${
                        isMe
                          ? 'bg-brand-primary text-white rounded-br-none font-medium'
                          : 'bg-bg-surface dark:bg-[#111827] text-text-secondary dark:text-gray-300 border border-border-custom dark:border-gray-850 rounded-bl-none shadow-sm'
                      }`}
                    >
                      {msg.content}
                    </div>
                    {/* Time indicator */}
                    <div className={`flex items-center gap-1 text-[8px] text-text-muted font-mono ${isMe ? 'justify-end' : ''}`}>
                      <span>{msg.timestamp}</span>
                      {isMe && <CheckCheck className="h-3 w-3 text-brand-primary" />}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messageEndRef} />
          </div>

          {/* Input text send block */}
          <form
            onSubmit={handleSend}
            className="p-4 bg-bg-surface dark:bg-[#111827] border-t border-border-custom dark:border-gray-800 flex items-center gap-3 shrink-0"
          >
            <input
              type="text"
              placeholder="Type your academic query or update here..."
              value={typedMessage}
              onChange={(e) => setTypedMessage(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs md:text-sm bg-bg-primary dark:bg-gray-850 border border-border-custom dark:border-gray-800 rounded-custom-md focus:outline-none focus:ring-2 focus:ring-brand-primary/25 transition-all font-sans text-text-primary"
            />
            <button
              type="submit"
              className="p-2.5 bg-brand-primary hover:bg-brand-hover text-white rounded-custom-md cursor-pointer transition-all shadow-custom-card shrink-0"
              title="Send Message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-bg-primary/10">
          <MessageCircle className="h-12 w-12 text-text-muted mb-2" />
          <p className="text-sm text-text-muted font-sans">Select a chat from the sidebar to start writing.</p>
        </div>
      )}

      {/* 3. Right Profile/Information Sidebar */}
      {activeChat && showProfileSidebar && (
        <div className="hidden lg:flex w-64 border-l border-border-custom dark:border-gray-800 flex-col justify-start p-5 bg-bg-surface dark:bg-[#111827] shrink-0 overflow-y-auto space-y-6">
          {/* User Meta Card */}
          <div className="text-center space-y-2 pb-4 border-b border-border-custom dark:border-gray-850">
            <img
              src={activeChat.avatar}
              alt={activeChat.name}
              referrerPolicy="no-referrer"
              className="h-16 w-16 rounded-full object-cover mx-auto border-2 border-border-custom dark:border-gray-800"
            />
            <div>
              <h4 className="text-sm font-bold text-text-primary dark:text-gray-200 font-display">
                {activeChat.name}
              </h4>
              <p className="text-[10px] text-brand-primary font-bold uppercase font-mono tracking-wider mt-0.5">
                {activeChat.type} CHAT
              </p>
            </div>
          </div>

          {/* Department and Bio Info */}
          <div className="space-y-4">
            <h5 className="text-[10px] font-bold text-text-muted uppercase tracking-wider font-mono">
              Contact Details
            </h5>

            <div className="space-y-3 text-[10px] font-sans text-text-secondary dark:text-gray-450 leading-relaxed">
              <div className="flex items-start gap-2">
                <Mail className="h-3.5 w-3.5 text-text-muted shrink-0" />
                <span className="truncate">{activeChat.name.toLowerCase().replace(/ /g, '.')}@university.edu</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 text-text-muted shrink-0" />
                <span>Science Annex, Room 22B</span>
              </div>
              <div className="flex items-start gap-2">
                <BookOpen className="h-3.5 w-3.5 text-text-muted shrink-0" />
                <span>Office: Tue/Thu 2:00-4:00 PM</span>
              </div>
            </div>
          </div>

          {/* Active Courses block (Faculty specific) */}
          {activeChat.type === 'faculty' && (
            <div className="space-y-3">
              <h5 className="text-[10px] font-bold text-text-muted uppercase tracking-wider font-mono">
                Assigned Modules
              </h5>
              <div className="p-3 bg-bg-primary dark:bg-gray-850/20 rounded-custom-md border border-border-custom dark:border-gray-800 space-y-1 text-left">
                <p className="text-[10px] font-bold text-brand-primary font-mono">CS-401</p>
                <p className="text-xs font-bold text-text-primary dark:text-gray-350 leading-snug">
                  Advanced Machine Learning
                </p>
                <p className="text-[9px] text-text-muted font-sans leading-none mt-1">
                  Instructing 45 registered seniors
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
