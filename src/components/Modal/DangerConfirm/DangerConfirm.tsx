import { useState } from "react"

import Modal from "@/ui/Modal"
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
    <Modal onClose={onClose}>
      {children}
      <div className="mt-5 text-base">
        <p>Please type the following to confirm:</p>
        <strong className="mt-2 block text-sm">{confirmText}</strong>
        <label htmlFor="confirmation-input" className="sr-only">
          Confirmation input
        </label>
        <input
          value={confirmationInput}
          onChange={(e) => setConfirmationInput(e.target.value)}
          id="confirmation-input"
          className="mt-5 w-full rounded-md border bg-zinc-50 px-2 py-1 focus:outline-zinc-600"
        />
        <Button
          onClick={handleConfirm}
          intent="danger"
          disabled={confirmationInput !== confirmText}
          className="mt-2 w-full rounded-md"
        >
          {dangerMessage}
        </Button>
      </div>
    </Modal>
  )
}
