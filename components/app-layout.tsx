"use client";

import { useState, useEffect } from "react";
import type { Chat } from "@/app/app/types";
import { ChatSidebar } from "./chat-sidebar";
import { Button } from "@/components/ui/button";
import { Menu, Sparkle, Edit2 } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type AppLayoutProps = {
  chats: Chat[];
  currentChatId: string | null;
  chatTitle: string;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onRenameChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  dailyUsed: number;
  dailyLimit: number;
  onUpgrade: () => void;
  onOpenSearch: () => void;
  userProfile: {
    name: string;
    username: string;
    avatarUrl?: string;
  };
  onOpenProfile: () => void;
  children: React.ReactNode;
};

export function AppLayout({
  chats,
  currentChatId,
  chatTitle,
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
    onSelectChat: (chatId: string) => {
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
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block shrink-0 transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-[80px]" : "w-80"
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
            <div className="flex items-center gap-2 pl-2 md:pl-0 truncate">
              <h2 className="text-lg font-semibold text-foreground truncate">
                {chatTitle}
              </h2>
              {currentChatId && (
                <button
                  className="cursor-pointer flex items-center justify-center size-8 rounded-full text-muted-foreground hover:bg-muted/30 hover:text-foreground shrink-0"
                  onClick={() => onRenameChat(currentChatId)}
                >
                  <Edit2 className="size-4" />
                </button>
              )}
            </div>

            <Button
              className="hidden md:flex rounded-full text-sm h-10 px-5"
              variant="app"
              onClick={onUpgrade}
            >
              <Sparkle className="size-4 fill-current" />
              Get Basic Plan
            </Button>
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
