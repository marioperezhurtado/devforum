export default function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <>
      <div
        onClick={onClose}
        className="fixed left-0 top-0 z-20 h-screen w-screen bg-black/50"
      />

      <div
        role="dialog"
        className="fixed left-1/2 top-1/4 z-20 w-full max-w-lg -translate-x-1/2 rounded-md border bg-white px-3 py-2 shadow-md md:mb-10 md:px-4 md:py-4"
      >
        {children}
      </div>
    </>
  )
}
