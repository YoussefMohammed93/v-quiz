"use client";

import { AppLayout } from "@/components/app-layout";
import { ChatView } from "@/components/chat-view";
import { MessageComposer } from "@/components/message-composer";
import { ChatSearch } from "@/components/chat-search";
import { UpgradeDrawer } from "@/components/upgrade-drawer";
import {
  ProfileSettingsDialog,
  type UserProfile,
} from "@/components/profile-settings-dialog";
import { useEffect, useState } from "react";
import { mockChats, mockMessages } from "./mock-data";
import type { Chat, Message } from "./types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AppPage() {
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [currentChatId, setCurrentChatId] = useState<string | null>(
    mockChats[0]?.id || null,
  );
  const [messages, setMessages] =
    useState<Record<string, Message[]>>(mockMessages);
  const [dailyUsed, setDailyUsed] = useState(2);
  const [dailyLimit] = useState(5);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Dialog states
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [chatToRename, setChatToRename] = useState<string | null>(null);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const [newChatTitle, setNewChatTitle] = useState("");

  // Profile State
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Youssef Mohammed",
    username: "youssefmohammed2093",
    avatarUrl: "https://github.com/shadcn.png",
  });

  const [upgradeDrawerOpen, setUpgradeDrawerOpen] = useState(false);

  const currentChat = chats.find((c) => c.id === currentChatId) || null;
  const currentMessages = currentChatId ? messages[currentChatId] || [] : [];

  // Shortcuts
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Handlers
  const handleNewChat = () => {
    const newChat: Chat = {
      id: `chat-${Date.now()}`,
      title: "New Chat",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setChats((prev) => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    setMessages((prev) => ({ ...prev, [newChat.id]: [] }));
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  const handleRenameChat = (chatId: string) => {
    const chat = chats.find((c) => c.id === chatId);
    if (chat) {
      setChatToRename(chatId);
      setNewChatTitle(chat.title);
      setRenameDialogOpen(true);
    }
  };

  const handleRenameChatConfirm = () => {
    if (chatToRename && newChatTitle.trim()) {
      setChats((prev) =>
        prev.map((c) =>
          c.id === chatToRename
            ? {
                ...c,
                title: newChatTitle.trim(),
                updatedAt: new Date().toISOString(),
              }
            : c,
        ),
      );
      setRenameDialogOpen(false);
      setChatToRename(null);
      setNewChatTitle("");
    }
  };

  const handleDeleteChat = (chatId: string) => {
    setChatToDelete(chatId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteChatConfirm = () => {
    if (chatToDelete) {
      setChats((prev) => prev.filter((c) => c.id !== chatToDelete));
      setMessages((prev) => {
        const next = { ...prev };
        delete next[chatToDelete];
        return next;
      });

      if (currentChatId === chatToDelete) {
        const remainingChats = chats.filter((c) => c.id !== chatToDelete);
        setCurrentChatId(remainingChats[0]?.id || null);
      }

      setDeleteDialogOpen(false);
      setChatToDelete(null);
    }
  };

  const handleSendMessage = ({
    text,
    imageFile,
  }: {
    text: string;
    imageFile?: File | null;
  }) => {
    if (!currentChatId || (!text && !imageFile)) return;

    setIsSending(true);

    // Simulate sending delay
    setTimeout(() => {
      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        role: "user",
        content: text,
        createdAt: new Date().toISOString(),
        imageUrl: imageFile ? URL.createObjectURL(imageFile) : undefined,
      };

      setMessages((prev) => ({
        ...prev,
        [currentChatId]: [...(prev[currentChatId] || []), userMessage],
      }));

      setIsTyping(true);
      setDailyUsed((prev) => prev + 1);

      // Simulate AI response
      setTimeout(() => {
        const assistantMessage: Message = {
          id: `msg-${Date.now() + 1}`,
          role: "assistant",
          content: `Thanks for your message! This is a mock response to: "${text}"`,
          createdAt: new Date().toISOString(),
        };

        setMessages((prev) => ({
          ...prev,
          [currentChatId]: [...(prev[currentChatId] || []), assistantMessage],
        }));

        setIsSending(false);
        setIsTyping(false);

        // Update chat title if it's a new chat
        const chat = chats.find((c) => c.id === currentChatId);
        if (chat && chat.title === "New Chat" && text.trim()) {
          const newTitle = text.slice(0, 50) + (text.length > 50 ? "..." : "");
          setChats((prev) =>
            prev.map((c) =>
              c.id === currentChatId
                ? { ...c, title: newTitle, updatedAt: new Date().toISOString() }
                : c,
            ),
          );
        }
      }, 1000);
    }, 500);
  };

  const handleAnswerQuestion = (
    questionId: string,
    choice: "A" | "B" | "C" | "D",
  ) => {
    if (!currentChatId) return;

    // Check for completion using current state to avoid side-effects in updater
    const currentChatMessages = messages[currentChatId] || [];
    let shouldTriggerSummary = false;
    let summaryResults = { correct: 0, total: 0, score: 0, topic: "" };

    const targetMessage = currentChatMessages.find((m) =>
      m.quiz?.questions.some((q) => q.id === questionId),
    );

    if (targetMessage?.quiz) {
      const wasAlreadyFinished = targetMessage.quiz.questions.every(
        (q) => q.userAnswer !== undefined,
      );

      const updatedQuestions = targetMessage.quiz.questions.map((q) =>
        q.id === questionId ? { ...q, userAnswer: choice } : q,
      );

      const isNowFinished = updatedQuestions.every(
        (q) => q.userAnswer !== undefined,
      );

      if (isNowFinished && !wasAlreadyFinished) {
        shouldTriggerSummary = true;
        const correctCount = updatedQuestions.filter(
          (q) => q.userAnswer === q.correctKey,
        ).length;
        summaryResults = {
          correct: correctCount,
          total: updatedQuestions.length,
          score: Math.round((correctCount / updatedQuestions.length) * 100),
          topic: targetMessage.quiz.topic,
        };
      }
    }

    setMessages((prev) => {
      const chatMessages = [...(prev[currentChatId] || [])];
      const updatedMessages = chatMessages.map((msg) => {
        if (msg.quiz) {
          return {
            ...msg,
            quiz: {
              ...msg.quiz,
              questions: msg.quiz.questions.map((q) =>
                q.id === questionId ? { ...q, userAnswer: choice } : q,
              ),
            },
          };
        }
        return msg;
      });

      return {
        ...prev,
        [currentChatId]: updatedMessages,
      };
    });

    if (shouldTriggerSummary) {
      setIsTyping(true);
      setTimeout(() => {
        const summaryMessage: Message = {
          id: `summary-${Date.now()}`,
          role: "assistant",
          content: `Congratulations! You've completed the quiz on ${summaryResults.topic}.`,
          createdAt: new Date().toISOString(),
          isSummary: true,
          summaryData: summaryResults,
        };

        setMessages((prev) => ({
          ...prev,
          [currentChatId]: [...(prev[currentChatId] || []), summaryMessage],
        }));
        setIsTyping(false);
      }, 1500);
    }
  };

  const handleUpgrade = () => {
    setUpgradeDrawerOpen(true);
  };

  const handleUpdateProfile = (newProfile: typeof userProfile) => {
    setUserProfile(newProfile);
  };

  return (
    <>
      <AppLayout
        chats={chats}
        currentChatId={currentChatId}
        chatTitle={currentChat?.title || "New Chat"}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onRenameChat={handleRenameChat}
        onDeleteChat={handleDeleteChat}
        dailyUsed={dailyUsed}
        dailyLimit={dailyLimit}
        onUpgrade={handleUpgrade}
        onOpenSearch={() => setSearchOpen(true)}
        userProfile={userProfile}
        onOpenProfile={() => setProfileDialogOpen(true)}
      >
        <div className="bg-muted/25 flex-1 flex flex-col min-h-0">
          <ChatView
            messages={currentMessages}
            onAnswerQuestion={handleAnswerQuestion}
            isTyping={isTyping}
          />
          <MessageComposer
            onSend={handleSendMessage}
            isSending={isSending}
            dailyUsed={dailyUsed}
            dailyLimit={dailyLimit}
            onUpgrade={handleUpgrade}
          />
        </div>
      </AppLayout>

      <ChatSearch
        chats={chats}
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onSelectChat={handleSelectChat}
      />

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent className="bg-secondary">
          <DialogHeader>
            <DialogTitle>Rename Chat</DialogTitle>
            <DialogDescription className="text-muted">
              Enter a new name for this chat conversation.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newChatTitle}
            onChange={(e) => setNewChatTitle(e.target.value)}
            placeholder="Chat title"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleRenameChatConfirm();
              }
            }}
          />
          <DialogFooter>
            <Button
              variant="outlineApp"
              className="h-10 px-5"
              onClick={() => setRenameDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRenameChatConfirm}
              variant="app"
              className="h-10 px-5"
            >
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-secondary">
          <DialogHeader>
            <DialogTitle>Delete Chat</DialogTitle>
            <DialogDescription className="text-muted">
              Are you sure you want to delete this chat? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outlineApp"
              className="h-10 px-5"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="app"
              className="h-10 px-5 !bg-red-400 !border-red-400 hover:!bg-red-400/80"
              onClick={handleDeleteChatConfirm}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Profile Settings Dialog */}
      <ProfileSettingsDialog
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
        initialProfile={userProfile}
        onSave={handleUpdateProfile}
      />
      <UpgradeDrawer
        open={upgradeDrawerOpen}
        onOpenChange={setUpgradeDrawerOpen}
      />
    </>
  );
}
