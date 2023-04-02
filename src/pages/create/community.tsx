import ForumLayout from "@/layout/ForumLayout/ForumLayout"
import Link from "next/link"
import CreateCommunity from "@/components/Community/CreateCommunity/CreateCommunity"

export default function CreatePostPage() {
  return (
    <ForumLayout
      title="Create a community - DevForum.dev"
      description="Everyone has something valuable to say.Take the plunge and share anything you want with other developers.
      "
    >
      <div className="mb-5 rounded-md border bg-white px-2 py-3 shadow-md md:px-6 md:py-4">
        <p className="mb-5 text-xl font-semibold">
          You might be starting something really cool.
        </p>
        <p className="mb-3">
          {
            "Create a community for your favorite topic or niche. It's free and easy."
          }
        </p>
        <p className="mb-3">
          This will be a place for other developers to discuss, share ideas, ask
          questions, and much more.
        </p>
        <p>
          {
            "You will start being owner and will be able to add moderators, and customize the community's details and appearance."
          }
        </p>

        <p className="mt-8 text-right text-sm">
          Make sure to follow the{" "}
          <Link
            href="#"
            className="transiton text-sky-600 underline hover:text-sky-500"
          >
            community guidelines.
          </Link>
        </p>
      </div>
      <CreateCommunity />
    </ForumLayout>
  )
}

/*
is the place for all programmers to learn, share, and connect with your community.
*/
