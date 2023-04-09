import ForumLayout from "@/layout/ForumLayout/ForumLayout"
import Link from "next/link"
import CreatePost from "@/components/Post/CreatePost/CreatePost"

export default function CreatePostPage() {
  return (
    <ForumLayout
      title="Create a post - DevForum.dev"
      description="Dive in and share anything you want with other developers.
      "
    >
      <div className="mb-5 rounded-md border bg-white px-2 py-3 shadow-md md:px-6 md:py-4">
        <p className="mb-5 text-xl font-semibold">
          Everyone has something valuable to say.
        </p>
        <p className="mb-3">
          Dive in and share anything you want with other developers.
        </p>
        <p>
          Share your knowledge, ask for help, rant about your projects and
          passions, or just say hi. Be yourself and have fun!
        </p>

        <p className="mt-8 text-right text-sm">
          Please be respectful and follow the{" "}
          <Link
            href="#"
            className="transiton text-sky-600 underline hover:text-sky-500"
          >
            community guidelines.
          </Link>
        </p>
      </div>
      <CreatePost />
    </ForumLayout>
  )
}
