import { ssg } from "@/server/api/root"
import { api } from "@/utils/api"
import { useRouter } from "next/router"

import ForumLayout from "@/layout/ForumLayout/ForumLayout"
import PostItem from "@/components/PostItem/PostItem"
import Button from "@/ui/Button"
import Comments from "@/components/Comments/Comments"

import type { GetServerSideProps } from "next"

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const id = ctx.params?.id
  const post = await ssg.post.getById.fetch(id as string)
  await ssg.comment.getByPostId.prefetch(id as string)

  if (!post)
    return {
      notFound: true,
    }

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  }
}

export default function PostPage() {
  const router = useRouter()
  const id = router.query.id as string

  const { data: post } = api.post.getById.useQuery(id)
  const { data: comments } = api.comment.getByPostId.useQuery(id)

  const topics = post?.topics?.map((t) => t.name).join(", #")

  return (
    <ForumLayout
      title={`${post?.title ?? ""} - by ${post?.creator.name ?? ""}
       at DevForum.dev`}
      description={`${post?.title ?? ""} - by ${post?.creator.name ?? ""}
       at DevForum.dev - ${topics ? `#${topics}` : ""}`}
    >
      {post && <PostItem post={post} />}
      {!comments?.length && (
        <div>
          <p className="mb-2 text-center text-xl font-semibold">
            Be the first to comment
          </p>
          <p className="mx-auto max-w-md text-center">
            {`You can make your voice heard. Share your thoughts, ask questions, and get
           involved in the conversation.`}
          </p>
          <Button className="mx-auto mt-5 block w-fit">Leave a comment</Button>
        </div>
      )}
      {!!comments?.length && <Comments comments={comments} />}
    </ForumLayout>
  )
}
