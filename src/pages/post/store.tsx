import { create } from "zustand"
import type { RouterOutputs } from "@/utils/api"

type Comment = RouterOutputs["comment"]["getByPostId"][0]

type CommentState = {
  isOpen: boolean
  replyTo: Comment | null
  open: () => void
  close: () => void
  reply: (comment: Comment) => void
}

export const useCommentStore = create<CommentState>((set) => ({
  isOpen: false,
  replyTo: null,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false, replyTo: null }),
  reply: (comment: Comment) => set({ isOpen: true, replyTo: comment }),
}))
