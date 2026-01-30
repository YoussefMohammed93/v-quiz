"use client";

import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import {
  type UserProfile,
  ProfileSettingsDialog,
} from "@/components/profile-settings-dialog";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChatView } from "@/components/chat-view";
import { AppLayout } from "@/components/app-layout";
import { useQuery, useMutation } from "convex/react";
import { ChatSearch } from "@/components/chat-search";
import type { Id } from "@/convex/_generated/dataModel";
import { UpgradeDrawer } from "@/components/upgrade-drawer";
import { MessageComposer } from "@/components/message-composer";

export default function AppPage() {
  // Convex Queries
  const chats = useQuery(api.chats.list) ?? [];
  const convexUser = useQuery(api.users.currentUser);
  const dailyUsage = useQuery(api.chats.getDailyUsage) ?? {
    used: 0,
    limit: 5,
    remaining: 5,
  };

  // Convex Mutations
  const createChat = useMutation(api.chats.create);
  const updateChatTitle = useMutation(api.chats.updateTitle);
  const deleteChat = useMutation(api.chats.remove);
  const sendMessage = useMutation(api.chats.sendMessage);
  const answerQuestion = useMutation(api.chats.answerQuestion);

  // Local State
  const [currentChatId, setCurrentChatId] = useState<Id<"chats"> | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Draft chats (frontend-only, not in database yet)
  const [draftChats, setDraftChats] = useState<
    Array<{
      id: string; // temporary ID
      title: string;
      createdAt: number;
      isDraft: true;
    }>
  >([]);

  // Merge draft chats with real chats for display
  const allChats = [
    ...draftChats.map((draft) => ({
      _id: draft.id as unknown as Id<"chats">, // Use string ID for drafts
      userId: "" as unknown as Id<"users">,
      title: draft.title,
      createdAt: draft.createdAt,
      updatedAt: draft.createdAt,
      isDraft: true,
    })),
    ...chats,
  ].sort((a, b) => b.updatedAt - a.updatedAt);

  // Dialog states
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [chatToRename, setChatToRename] = useState<Id<"chats"> | null>(null);
  const [chatToDelete, setChatToDelete] = useState<Id<"chats"> | null>(null);
  const [newChatTitle, setNewChatTitle] = useState("");

  // Profile State
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [upgradeDrawerOpen, setUpgradeDrawerOpen] = useState(false);

  // Query messages for current chat (skip if it's a draft)
  const isDraftChat = draftChats.some((d) => d.id === currentChatId);
  const currentMessages =
    useQuery(
      api.chats.getMessages,
      currentChatId && !isDraftChat ? { chatId: currentChatId } : "skip",
    ) ?? [];

  const userProfile: UserProfile = convexUser
    ? {
        name:
          convexUser.firstName && convexUser.lastName
            ? `${convexUser.firstName} ${convexUser.lastName}`
            : convexUser.email || "User",
        username: convexUser.email?.split("@")[0] || "user",
        avatarUrl: convexUser.imageUrl || "/placeholder.png",
        plan: convexUser.plan,
      }
    : {
        name: "",
        username: "",
        avatarUrl: "",
        plan: "",
      };

  const currentChat = allChats.find((c) => c._id === currentChatId) || null;

  // Intelligent session-based chat initialization
  useEffect(() => {
    // On first load, check sessionStorage for active chat
    const sessionChatId = sessionStorage.getItem("activeChatId");

    if (sessionChatId && chats.length > 0) {
      // If we have a session chat and it exists in real chats, restore it
      const sessionChat = chats.find((c) => c._id === sessionChatId);
      if (sessionChat) {
        setCurrentChatId(sessionChat._id);
        return;
      }
    }

    // Otherwise, create a new draft chat for fresh session
    if (!currentChatId && chats.length >= 0) {
      handleNewChat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Save current chat to sessionStorage whenever it changes
  useEffect(() => {
    if (currentChatId && !isDraftChat) {
      sessionStorage.setItem("activeChatId", currentChatId as string);
    } else if (!currentChatId) {
      sessionStorage.removeItem("activeChatId");
    }
  }, [currentChatId, isDraftChat]);

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
    // Create a draft chat (frontend-only) that appears in sidebar immediately
    const draftId = `draft-${Date.now()}`;
    const newDraft = {
      id: draftId,
      title: "New Chat",
      createdAt: Date.now(),
      isDraft: true as const,
    };

    setDraftChats((prev) => [newDraft, ...prev]);
    setCurrentChatId(draftId as unknown as Id<"chats">);
  };

  const handleSelectChat = (chatId: Id<"chats">) => {
    setCurrentChatId(chatId);
  };

  const handleRenameChat = (chatId: Id<"chats">) => {
    // Can't rename draft chats
    const isDraft = draftChats.some((d) => d.id === chatId);
    if (isDraft) return;

    const chat = chats.find((c) => c._id === chatId);
    if (chat) {
      setChatToRename(chatId);
      setNewChatTitle(chat.title);
      setRenameDialogOpen(true);
    }
  };

  const handleRenameChatConfirm = async () => {
    if (chatToRename && newChatTitle.trim()) {
      try {
        await updateChatTitle({
          chatId: chatToRename,
          title: newChatTitle.trim(),
        });
        setRenameDialogOpen(false);
        setChatToRename(null);
        setNewChatTitle("");
        toast.success("Chat renamed successfully");
      } catch (error) {
        console.error("Failed to rename chat:", error);
        toast.error("Failed to rename chat");
      }
    }
  };

  const handleDeleteChat = (chatId: Id<"chats">) => {
    // If it's a draft, just remove from local state
    const draftIndex = draftChats.findIndex((d) => d.id === chatId);
    if (draftIndex !== -1) {
      setDraftChats((prev) => prev.filter((d) => d.id !== chatId));
      if (currentChatId === chatId) {
        const remaining = allChats.filter((c) => c._id !== chatId);
        setCurrentChatId(remaining[0]?._id || null);
      }
      return;
    }

    // Otherwise, show delete confirmation for real chat
    setChatToDelete(chatId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteChatConfirm = async () => {
    if (chatToDelete) {
      try {
        await deleteChat({ chatId: chatToDelete });

        // Switch to another chat if the deleted one was active
        if (currentChatId === chatToDelete) {
          const remainingChats = chats.filter((c) => c._id !== chatToDelete);
          setCurrentChatId(remainingChats[0]?._id || null);
        }

        setDeleteDialogOpen(false);
        setChatToDelete(null);
        toast.success("Chat deleted successfully");
      } catch (error) {
        console.error("Failed to delete chat:", error);
        toast.error("Failed to delete chat");
      }
    }
  };

  const handleSendMessage = async ({
    text,
  }: {
    text: string;
    imageFile?: File | null;
  }) => {
    if (!text.trim()) return;

    setIsSending(true);

    try {
      let chatId = currentChatId;

      // Check if current chat is a draft
      const draftChat = draftChats.find((d) => d.id === chatId);

      if (draftChat) {
        // Create the chat in the database first
        const newTitle = text.slice(0, 50) + (text.length > 50 ? "..." : "");
        const realChatId = await createChat({ title: newTitle });

        // Remove from draft chats
        setDraftChats((prev) => prev.filter((d) => d.id !== draftChat.id));

        // Update current chat ID to the real one
        chatId = realChatId;
        setCurrentChatId(realChatId);
      }

      // Send user message (chatId is now guaranteed to be a real chat)
      await sendMessage({
        chatId: chatId!,
        content: text.trim(),
      });

      // Update chat title if it's still "New Chat" (for non-draft existing chats)
      if (!draftChat) {
        const chat = chats.find((c) => c._id === chatId);
        if (chat && chat.title === "New Chat") {
          const newTitle = text.slice(0, 50) + (text.length > 50 ? "..." : "");
          await updateChatTitle({
            chatId: chatId!,
            title: newTitle,
          });
        }
      }

      setIsSending(false);
    } catch (error) {
      setIsSending(false);

      // Check if it's a limit error
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (errorMessage === "DAILY_LIMIT_REACHED") {
        toast.error("Daily message limit reached");
        setUpgradeDrawerOpen(true);
      } else {
        console.error("Failed to send message:", error);
        toast.error("Failed to send message");
      }
    }
  };

  const handleAnswerQuestion = async (
    questionId: string,
    choice: "A" | "B" | "C" | "D",
  ) => {
    // Can't answer questions in "new chat mode"
    if (!currentChatId) return;

    try {
      // Find the message with this question
      const messageWithQuiz = currentMessages.find((m) =>
        m.quiz?.questions.some((q) => q.id === questionId),
      );

      if (messageWithQuiz) {
        await answerQuestion({
          messageId: messageWithQuiz._id,
          questionId,
          answer: choice,
        });
      }
    } catch (error) {
      console.error("Failed to answer question:", error);
      toast.error("Failed to save answer");
    }
  };

  const handleUpgrade = () => {
    setUpgradeDrawerOpen(true);
  };

  return (
    <>
      <AppLayout
        chats={allChats}
        currentChatId={currentChatId}
        chatTitle={currentChat?.title || "New Chat"}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onRenameChat={handleRenameChat}
        onDeleteChat={handleDeleteChat}
        dailyUsed={dailyUsage.used}
        dailyLimit={dailyUsage.limit === Infinity ? 999 : dailyUsage.limit}
        onUpgrade={handleUpgrade}
        onOpenSearch={() => setSearchOpen(true)}
        userProfile={userProfile}
        onOpenProfile={() => setProfileDialogOpen(true)}
        isLoading={convexUser === undefined}
      >
        <div className="bg-muted/25 flex-1 flex flex-col min-h-0">
          <ChatView
            messages={currentMessages}
            onAnswerQuestion={handleAnswerQuestion}
            isTyping={false}
          />
          <MessageComposer
            onSend={handleSendMessage}
            isSending={isSending}
            dailyUsed={dailyUsage.used}
            dailyLimit={dailyUsage.limit === Infinity ? 999 : dailyUsage.limit}
            onUpgrade={handleUpgrade}
          />
        </div>
      </AppLayout>

      <ChatSearch
        chats={allChats}
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
      />
      <UpgradeDrawer
        open={upgradeDrawerOpen}
        onOpenChange={setUpgradeDrawerOpen}
      />
    </>
  );
}
