import { Skeleton } from "@/components/ui/skeleton";

export function ChatMessagesSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-4 max-w-3xl mx-auto w-full">
      {/* User Message Skeleton (Styled like a card) */}
      <div className="grid grid-cols-[auto_1fr] gap-x-4 md:flex md:gap-4 px-4 py-6 bg-muted/10 rounded-3xl border border-muted/15">
        <Skeleton className="size-10 rounded-full shrink-0" /> {/* Avatar */}
        <div className="contents md:block md:flex-1 md:min-w-0">
          <div className="flex items-center gap-2 mb-2 col-start-2 self-center">
            <Skeleton className="h-4 w-12 rounded" /> {/* Name */}
            <Skeleton className="h-3 w-8 rounded" /> {/* Time */}
          </div>
          <div className="col-span-2 md:col-auto mt-2 md:mt-0 space-y-2">
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[75%]" />
          </div>
        </div>
      </div>

      {/* AI Message Skeleton (Transparent) */}
      <div className="grid grid-cols-[auto_1fr] gap-x-4 md:flex md:gap-4 px-0 md:px-4 bg-transparent">
        <Skeleton className="size-10 rounded-full shrink-0" /> {/* Avatar */}
        <div className="contents md:block md:flex-1 md:min-w-0">
          <div className="flex items-center gap-2 mb-2 col-start-2 self-center">
            <Skeleton className="h-4 w-20 rounded" /> {/* Name */}
            <Skeleton className="h-3 w-8 rounded" /> {/* Time */}
          </div>
          <div className="col-span-2 md:col-auto mt-2 md:mt-0 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[95%]" />
            <Skeleton className="h-4 w-[85%]" />
            <Skeleton className="h-[100px] w-full rounded-xl mt-4" />{" "}
            {/* Potential Block/Quiz */}
          </div>
        </div>
      </div>

      {/* User Message Skeleton (Styled like a card) */}
      <div className="grid grid-cols-[auto_1fr] gap-x-4 md:flex md:gap-4 px-4 py-6 bg-muted/10 rounded-3xl border border-muted/15">
        <Skeleton className="size-10 rounded-full shrink-0" /> {/* Avatar */}
        <div className="contents md:block md:flex-1 md:min-w-0">
          <div className="flex items-center gap-2 mb-2 col-start-2 self-center">
            <Skeleton className="h-4 w-12 rounded" /> {/* Name */}
            <Skeleton className="h-3 w-8 rounded" /> {/* Time */}
          </div>
          <div className="col-span-2 md:col-auto mt-2 md:mt-0 space-y-2">
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ChatHeaderSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-6 w-[150px] md:w-[200px] rounded-md" />
    </div>
  );
}

export function ChatInputSkeleton() {
  return (
    <div className="p-2 md:p-[11px] w-full">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Skeleton className="h-[56px] w-full rounded-[28px]" />
          </div>
          <Skeleton className="size-12 md:size-14 shrink-0 rounded-full" />
        </div>
        <div className="mt-2 ml-1">
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    </div>
  );
}
