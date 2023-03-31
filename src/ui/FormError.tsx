export default function FormError({ message }: { message: string }) {
  return (
    <p className="w-fit rounded-md border border-red-100 bg-red-50 px-2.5 py-1 text-sm text-red-600">
      {message}
    </p>
  )
}
