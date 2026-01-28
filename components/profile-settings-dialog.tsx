"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Camera } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type UserProfile = {
  name: string;
  username: string;
  avatarUrl?: string;
};

type ProfileSettingsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
};

export function ProfileSettingsDialog({
  open,
  onOpenChange,
  initialProfile,
  onSave,
}: ProfileSettingsDialogProps) {
  const [name, setName] = useState(initialProfile.name);
  const [username] = useState(initialProfile.username);
  const [avatarUrl, setAvatarUrl] = useState(initialProfile.avatarUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      if (initialProfile.name !== name) setName(initialProfile.name);
      if (initialProfile.avatarUrl !== avatarUrl)
        setAvatarUrl(initialProfile.avatarUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialProfile]);

  const handleSave = () => {
    onSave({
      name: name.trim() || initialProfile.name,
      username,
      avatarUrl,
    });
    onOpenChange(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-secondary">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-4">
          {/* Avatar Section */}
          <div
            className="relative group cursor-pointer"
            onClick={handleAvatarClick}
          >
            <Avatar className="size-24 border-2 border-border">
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                {name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="size-8 text-white" />
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div className="w-full space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Display name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Display Name"
                className="col-span-3 underline-offset-0 mt-2"
              />
            </div>
          </div>

          <div className="w-full text-center text-sm text-muted">
            <p>
              Your profile helps people recognize you. Your display name is
              visible to other users in VQuiz.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outlineApp"
            onClick={() => onOpenChange(false)}
            className="h-10 px-6"
          >
            Cancel
          </Button>
          <Button variant="app" className="h-10 px-6" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
