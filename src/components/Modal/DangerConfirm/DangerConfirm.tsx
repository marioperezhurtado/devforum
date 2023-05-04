import { useState } from "react"

import Button from "@/ui/Button"

type Props = {
  confirmText: string
  dangerMessage: string
  onConfirm: () => void
  onClose: () => void
  children: React.ReactNode
}

export default function DangerConfirm({
  confirmText,
  dangerMessage,
  onConfirm,
  onClose,
  children,
}: Props) {
  const [confirmationInput, setConfirmationInput] = useState("")

  const handleConfirm = () => {
    if (confirmationInput === confirmText) {
      onConfirm()
      onClose()
    }
  }

  return (
    <>
      <div
        onClick={onClose}
        className="fixed left-0 top-0 z-10 h-screen w-screen bg-black/50"
      />
      <div
        role="dialog"
        className="fixed left-1/2 top-1/4 z-20 max-w-md -translate-x-1/2 rounded-md  border bg-white px-3 py-2 shadow-md md:mb-10 md:px-6 md:py-4"
      >
        {children}
        <div className="mt-8">
          <p>Please type the following to confirm:</p>
          <strong className="mt-2 block italic">{confirmText}</strong>
          <label htmlFor="confirmation-input" className="sr-only">
            Confirmation input
          </label>
          <input
            value={confirmationInput}
            onChange={(e) => setConfirmationInput(e.target.value)}
            id="confirmation-input"
            className="mt-2 w-full rounded-full border bg-zinc-50 px-3 py-1 focus:outline-zinc-600"
          />
          <Button
            onClick={handleConfirm}
            intent="danger"
            disabled={confirmationInput !== confirmText}
            className="mt-2 w-full"
          >
            {dangerMessage}
          </Button>
        </div>
      </div>
    </>
  )
}
