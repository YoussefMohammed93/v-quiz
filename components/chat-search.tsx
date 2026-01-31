"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { Chat } from "@/app/app/types";
import { MessageSquare } from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel";

import { useState } from "react";

type ChatSearchProps = {
  chats: Chat[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectChat: (chatId: Id<"chats">) => void;
};

export function ChatSearch({
  chats,
  open,
  onOpenChange,
  onSelectChat,
}: ChatSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = searchQuery.trim() === "" ? chats.slice(0, 5) : chats;

  return (
    <CommandDialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) setSearchQuery("");
      }}
    >
      <CommandInput
        placeholder="Search chats..."
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading={searchQuery ? "Results" : "Recent Chats"}>
          {filteredChats.map((chat) => (
            <CommandItem
              key={chat._id}
              onSelect={() => {
                onSelectChat(chat._id);
                onOpenChange(false);
                setSearchQuery("");
              }}
              className="cursor-pointer border-b border-border/75 last:border-none rounded-none"
            >
              <MessageSquare className="size-4" />
              <span>{chat.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
