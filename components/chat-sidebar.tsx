"use client";

import Link from "next/link";
import Image from "next/image";

import {
  Plus,
  Edit2,
  Trash2,
  Sidebar,
  Search,
  MoreHorizontal,
  LogOut,
  User,
  ArrowUpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useClerk } from "@clerk/nextjs";
import type { Chat } from "@/app/app/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ChatSidebarProps = {
  chats: Chat[];
  currentChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onRenameChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onOpenSearch: () => void;
  dailyUsed: number;
  dailyLimit: number;
  onUpgrade: () => void;
  isCollapsed?: boolean;
  onToggle?: () => void;
  userProfile: {
    name: string;
    username: string;
    avatarUrl?: string;
    plan?: string;
  };
  onOpenProfile: () => void;
  isLoading?: boolean;
};

export function ChatSidebar({
  chats,
  currentChatId,
  onNewChat,
  onSelectChat,
  onRenameChat,
  onDeleteChat,
  onOpenSearch,
  onUpgrade,
  isCollapsed = false,
  onToggle,
  userProfile,
  onOpenProfile,
  isLoading,
}: ChatSidebarProps) {
  const { signOut } = useClerk();

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-muted/20 border-r border-border/45 transition-all duration-300",
        isCollapsed ? "items-center" : "",
      )}
    >
      {/* Logo & Brand */}
      <div
        className={cn(
          "flex items-center p-3 h-[70px]",
          isCollapsed
            ? "justify-center w-full relative group"
            : "justify-between w-full",
        )}
      >
        {!isCollapsed ? (
          <>
            <Link
              href="/app"
              className="flex items-center gap-2 group text-2xl sm:text-3xl hover:text-foreground/80 transition-colors duration-200 font-semibold text-foreground font-mono"
            >
              <Image
                src="/logo.svg"
                alt="Logo"
                width={36}
                height={36}
                className="group-hover:opacity-80 duration-200"
              />
              <p>Vquiz</p>
            </Link>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    onClick={onToggle}
                    className="hidden md:flex cursor-pointer items-center justify-center size-9 rounded-xl bg-secondary/5 hover:bg-muted/20 text-foreground"
                  >
                    <Sidebar className="size-5" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">Close Sidebar</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        ) : (
          <div className="relative flex items-center justify-center size-9">
            {/* Logo - Hidden on hover */}
            <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 group-hover:opacity-0">
              <Image src="/logo.svg" alt="Logo" width={32} height={32} />
            </div>
            {/* Sidebar Icon - Shown on hover */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    onClick={onToggle}
                    className="hidden md:flex absolute inset-0 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer rounded-xl hover:bg-muted/20 text-foreground"
                  >
                    <Sidebar className="size-5" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">Open Sidebar</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
      {/* New Chat & Search Buttons */}
      <div
        className={cn(
          "px-2 space-y-1",
          isCollapsed ? "mt-4 w-full flex flex-col items-center" : "",
        )}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onNewChat}
                className={cn(
                  "cursor-pointer rounded-xl flex items-center bg-secondary/5 hover:bg-muted/20 text-foreground transition-all duration-200",
                  isCollapsed
                    ? "size-10 justify-center p-0"
                    : "w-full text-sm gap-2 p-3",
                )}
              >
                <Plus className={isCollapsed ? "size-5" : "size-4.5"} />
                {!isCollapsed && "New Chat"}
              </button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">New Chat</TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onOpenSearch}
                className={cn(
                  "cursor-pointer rounded-xl flex items-center bg-secondary/5 hover:bg-muted/20 text-foreground transition-all duration-200",
                  isCollapsed
                    ? "size-10 justify-center p-0"
                    : "w-full text-sm gap-2 p-3",
                )}
              >
                <Search className={isCollapsed ? "size-5" : "size-4.5"} />
                {!isCollapsed && "Search Chats"}
              </button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">Search Chats</TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
      {/* Chat List - Hidden when collapsed */}
      {!isCollapsed && (
        <>
          <div className="px-4 pb-2 pt-6">
            <h3 className="text-xs font-medium text-muted uppercase tracking-wider">
              Recent
            </h3>
          </div>
          <ScrollArea className="flex-1 px-2">
            <div className="space-y-1 pb-4">
              {isLoading ? (
                <>
                  <Skeleton className="h-10 w-full rounded-xl opacity-90" />
                  <Skeleton className="h-10 w-full rounded-xl opacity-70" />
                  <Skeleton className="h-10 w-full rounded-xl opacity-50" />
                  <Skeleton className="h-10 w-full rounded-xl opacity-30" />
                </>
              ) : (
                chats.map((chat) => {
                  const isActive = chat.id === currentChatId;
                  return (
                    <div key={chat.id} className="relative group">
                      <div
                        onClick={() => onSelectChat(chat.id)}
                        className={cn(
                          "group relative flex items-start gap-2 rounded-xl px-3 py-2.5 cursor-pointer border border-transparent",
                          isActive
                            ? "bg-muted/15 hover:bg-muted/20"
                            : "hover:bg-muted/20",
                        )}
                      >
                        <div className="flex-1 min-w-0 pr-6">
                          <span
                            className={cn(
                              "block truncate text-sm transition-colors",
                              isActive
                                ? "text-foreground"
                                : "text-muted-foreground",
                            )}
                          >
                            {chat.title}
                          </span>
                        </div>
                      </div>
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="cursor-pointer flex items-center justify-center size-8 hover:bg-muted/30 rounded-full">
                              <MoreHorizontal className="size-4.5 text-muted-foreground" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="start"
                            className="w-32 bg-secondary border-border/45"
                          >
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                onRenameChat(chat.id);
                              }}
                            >
                              <Edit2 className="size-4" />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteChat(chat.id);
                              }}
                              className="!hover:bg-muted/20 text-red-400 cursor-pointer"
                            >
                              <Trash2 className="size-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </>
      )}
      {/* Spacer when collapsed to push bottom section down */}
      {isCollapsed && <div className="flex-1" />}
      {/* Bottom Section: Usage & User Profile */}
      <div className={cn(isCollapsed ? "mb-4" : "")}>
        {/* User Profile */}
        <div className={cn("p-2", !isCollapsed && "border-t border-border/45")}>
          <div
            className={cn(
              "flex items-center gap-2",
              isCollapsed ? "justify-center" : "justify-between",
            )}
          >
            <Popover>
              <PopoverTrigger asChild>
                <div
                  className={cn(
                    "flex items-center gap-2 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer",
                    isCollapsed
                      ? "p-0 bg-transparent hover:bg-transparent"
                      : "p-2",
                  )}
                >
                  {isLoading ? (
                    <Skeleton
                      className={cn(
                        "rounded-full",
                        isCollapsed ? "size-9" : "size-10",
                      )}
                    />
                  ) : (
                    <Avatar
                      className={cn(
                        "border border-border/45",
                        isCollapsed ? "size-9" : "size-10",
                      )}
                    >
                      <AvatarImage
                        src={userProfile?.avatarUrl}
                        alt={`${userProfile?.name}'s profile picture`}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                        {userProfile?.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0 space-y-1">
                      {isLoading ? (
                        <>
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-16" />
                        </>
                      ) : (
                        <>
                          <p className="text-[15px] font-medium text-foreground truncate max-w-[135px]">
                            {userProfile?.name}
                          </p>
                          <p className="text-[14px] text-muted truncate max-w-[135px]">
                            {userProfile?.plan === "pro"
                              ? "Pro Plan"
                              : userProfile?.plan === "basic"
                                ? "Basic Plan"
                                : "Free Plan"}
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </PopoverTrigger>
              <PopoverContent
                className="w-56 p-1 ml-1 mb-2 bg-[#222] border-border/45"
                side={isCollapsed ? "right" : "top"}
                align={isCollapsed ? "start" : "center"}
              >
                <div className="space-y-1">
                  <div
                    onClick={onOpenProfile}
                    className="flex items-center gap-2 p-2 hover:bg-muted/15 rounded-md cursor-pointer transition-colors"
                  >
                    <User className="size-4 text-muted-foreground" />
                    <span className="text-sm">Profile</span>
                  </div>
                  <div
                    onClick={onUpgrade}
                    className="flex items-center gap-2 p-2 hover:bg-muted/15 rounded-md cursor-pointer transition-colors"
                  >
                    <ArrowUpCircle className="size-4 text-muted-foreground" />
                    <span className="text-sm">Upgrade</span>
                  </div>
                  <div className="h-px bg-border/20 my-1" />
                  <div
                    onClick={() => signOut()}
                    className="flex items-center gap-2 p-2 hover:bg-red-500/10 text-red-500 rounded-md cursor-pointer transition-colors"
                  >
                    <LogOut className="size-4" />
                    <span className="text-sm">Log out</span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            {!isCollapsed &&
              (isLoading ? (
                <Skeleton className="h-10 w-24 rounded-full" />
              ) : (
                <Button
                  onClick={onUpgrade}
                  variant="app"
                  className="w-auto h-10 text-sm px-4 rounded-full"
                >
                  Upgrade
                </Button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
