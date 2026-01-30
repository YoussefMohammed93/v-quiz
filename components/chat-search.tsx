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
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search chats..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Recent Chats">
          {chats.map((chat) => (
            <CommandItem
              key={chat._id}
              onSelect={() => {
                onSelectChat(chat._id);
                onOpenChange(false);
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
