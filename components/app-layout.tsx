"use client";

import type { Chat } from "@/app/app/types";
import type { Id } from "@/convex/_generated/dataModel";

import { useState, useEffect } from "react";
import { ChatSidebar } from "./chat-sidebar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatHeaderSkeleton } from "@/components/chat-skeletons";
import { Menu, Sparkle, Edit2, Star, SparkleIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type AppLayoutProps = {
  chats: Chat[];
  currentChatId: Id<"chats"> | null;
  chatTitle: string;
  isChatLoading?: boolean;
  onNewChat: () => void;
  onSelectChat: (chatId: Id<"chats">) => void;
  onRenameChat: (chatId: Id<"chats">) => void;
  onDeleteChat: (chatId: Id<"chats">) => void;
  dailyUsed: number;
  dailyLimit: number;
  onUpgrade: () => void;
  // ... other props
  onOpenSearch: () => void;
  userProfile: {
    name: string;
    username: string;
    avatarUrl?: string;
    plan?: string;
  };
  onOpenProfile: () => void;
  isLoading?: boolean;
  children: React.ReactNode;
};

export function AppLayout({
  chats,
  currentChatId,
  chatTitle,
  isChatLoading,
  onNewChat,
  onSelectChat,
  onRenameChat,
  onDeleteChat,
  dailyUsed,
  dailyLimit,
  onUpgrade,
  onOpenSearch,
  userProfile,
  onOpenProfile,
  isLoading,
  children,
}: AppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed !== isCollapsed) {
        setIsCollapsed(parsed);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebarCollapsed", JSON.stringify(newState));
  };

  const sidebarProps = {
    chats,
    currentChatId,
    onNewChat,
    onSelectChat: (chatId: Id<"chats">) => {
      onSelectChat(chatId);
      setIsSidebarOpen(false);
    },
    onRenameChat,
    onDeleteChat,
    dailyUsed,
    dailyLimit,
    onUpgrade,
    onOpenSearch,
    isCollapsed,
    onToggle: handleToggleCollapse,
    userProfile,
    onOpenProfile,
    isLoading,
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block shrink-0 transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-[80px]" : "w-72"
        }`}
      >
        <ChatSidebar {...sidebarProps} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 min-h-0 bg-background overflow-hidden relative">
        {/* Header Bar */}
        <header className="border-b border-border/45 bg-muted/25 backdrop-blur-sm px-4 py-3 flex items-center justify-between gap-3 sticky top-0 z-10 shrink-0">
          <div className="w-full flex items-center justify-between gap-3 min-w-0">
            {/* Mobile Menu */}
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild className="md:hidden">
                <button className="cursor-pointer flex items-center justify-center size-8 rounded-full text-muted-foreground hover:bg-muted/30 hover:text-foreground shrink-0">
                  <Menu className="size-5" />
                </button>
              </SheetTrigger>

              <SheetContent side="left" className="p-0 w-80 border-none">
                <ChatSidebar {...sidebarProps} />
              </SheetContent>
            </Sheet>

            {/* Chat Title */}
            <div className="flex items-center gap-2 pl-2 md:pl-0 truncate flex-1 md:flex-none">
              {isChatLoading ? (
                <ChatHeaderSkeleton />
              ) : (
                <>
                  <h2 className="text-lg font-semibold text-foreground truncate">
                    {chatTitle}
                  </h2>
                  {currentChatId && chatTitle !== "New Chat" && (
                    <button
                      className="cursor-pointer flex items-center justify-center size-8 rounded-full text-muted-foreground hover:bg-muted/30 hover:text-foreground shrink-0"
                      onClick={() => onRenameChat(currentChatId)}
                    >
                      <Edit2 className="size-4" />
                    </button>
                  )}
                </>
              )}
            </div>

            {isLoading ? (
              <div className="hidden md:block">
                <Skeleton className="h-10 w-[150px] rounded-full" />
              </div>
            ) : userProfile.plan === "pro" ? (
              <div className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full bg-linear-to-r from-primary/20 to-primary/10 border border-primary/20 backdrop-blur-sm">
                <Star className="size-4 text-primary fill-current" />
                <span className="text-sm font-semibold font-mono bg-linear-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Pro Plan
                </span>
              </div>
            ) : userProfile.plan === "basic" ? (
              <div className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full bg-linear-to-r from-blue-500/20 to-blue-500/10 border border-blue-500/15 backdrop-blur-sm">
                <SparkleIcon className="size-4 text-blue-500 fill-current" />
                <span className="text-sm font-semibold font-mono bg-linear-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent">
                  Basic Plan
                </span>
              </div>
            ) : (
              <Button
                className="hidden md:flex rounded-full text-sm h-10 px-5"
                variant="app"
                onClick={onUpgrade}
              >
                <Sparkle className="size-4 fill-current" />
                Upgrade Your Plan
              </Button>
            )}
          </div>
        </header>

        {/* Chat Area Container */}
        <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
