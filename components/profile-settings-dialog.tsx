"use client";

import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Camera } from "lucide-react";
import { useMutation } from "convex/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { useEffect, useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type UserProfile = {
  name: string;
  username: string;
  avatarUrl?: string;
  plan?: string;
};

type ProfileSettingsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialProfile: UserProfile;
};

export function ProfileSettingsDialog({
  open,
  onOpenChange,
  initialProfile,
}: ProfileSettingsDialogProps) {
  const [name, setName] = useState(initialProfile.name);
  const [avatarUrl, setAvatarUrl] = useState(initialProfile.avatarUrl);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const updateUser = useMutation(api.users.updateUser);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      if (initialProfile.name !== name) setName(initialProfile.name);
      if (initialProfile.avatarUrl !== avatarUrl)
        setAvatarUrl(initialProfile.avatarUrl);
      setSelectedImage(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialProfile]);

  const handleSave = async () => {
    // 1. Close dialog immediately
    onOpenChange(false);

    try {
      // 2. Handle Image Upload if changed
      let storageId: Id<"_storage"> | undefined;

      if (selectedImage) {
        // Show uploading toast
        const uploadToastId = toast.loading("Uploading profile picture... 0%");

        try {
          // Get upload URL
          const postUrl = await generateUploadUrl();

          // Upload file using XHR for progress
          const { storageId: uploadedStorageId } = await new Promise<{
            storageId: string;
          }>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", postUrl);
            xhr.setRequestHeader("Content-Type", selectedImage.type);

            xhr.upload.onprogress = (event) => {
              if (event.lengthComputable) {
                const percentComplete = Math.round(
                  (event.loaded / event.total) * 100,
                );
                toast.loading(
                  `Uploading profile picture... ${percentComplete}%`,
                  {
                    id: uploadToastId,
                  },
                );
              }
            };

            xhr.onload = () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                try {
                  const response = JSON.parse(xhr.responseText);
                  resolve(response);
                } catch {
                  reject(new Error("Invalid response format"));
                }
              } else {
                reject(new Error(`Upload failed: ${xhr.statusText}`));
              }
            };

            xhr.onerror = () => reject(new Error("Network error"));
            xhr.send(selectedImage);
          });

          storageId = uploadedStorageId as Id<"_storage">;

          toast.dismiss(uploadToastId);
        } catch (error) {
          toast.dismiss(uploadToastId);
          toast.error("Failed to upload image");
          console.error(error);
          return; // Stop if upload fails
        }
      }

      // 3. Update User Profile
      // Only show toast if name changed or just finished uploading
      const isNameChanged = name.trim() !== initialProfile.name;

      if (isNameChanged || storageId) {
        await updateUser({
          name: name.trim(),
          avatarStorageId: storageId, // undefined if not changed, ensuring we don't clear existing
        });

        toast.success("Profile updated successfully!");

        // Update parent state via callback if needed, but the live query will update UI automatically
        // onSave({ ...initialProfile, ...updates }); -> onSave prop might not be needed for data sync if using Convex live query
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
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
            <Avatar className="size-28 border-2 border-border">
              <AvatarImage
                src={avatarUrl}
                alt={name}
                className="object-cover"
              />
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
