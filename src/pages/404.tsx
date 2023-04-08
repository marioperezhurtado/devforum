import ForumLayout from "@/layout/ForumLayout/ForumLayout"
import Link from "next/link"
import Button from "@/ui/Button"

export default function ErrorPage() {
  return (
    <ForumLayout
      title="Page not found - DevForum.dev"
      description="This page does not exist. It may have been deleted or moved."
    >
      <div className="mt-5 text-center">
        <h1 className="mb-5 text-3xl font-bold">Page not found</h1>
        <p className="text-lg">
          This page does not exist. It may have been deleted or moved.
        </p>
        <p className="mt-2 text-lg">
          If you keep having this issue, please{" "}
          <Link href="/contact" className="text-sky-600 underline">
            contact us
          </Link>
        </p>
        <Link href="/">
          <Button className="mt-5">Back to homepage</Button>
        </Link>
      </div>
    </ForumLayout>
  )
}
