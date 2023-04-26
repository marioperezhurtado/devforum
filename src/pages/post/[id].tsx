import { ssg } from "@/server/api/root"
import { api } from "@/utils/api"
import { useRouter } from "next/router"
import { useCommentStore } from "@/components/Comment/store"

import Head from "next/head"
import ForumLayout from "@/layout/ForumLayout/ForumLayout"
import PostItem from "@/components/Post/PostItem/PostItem"
import Button from "@/ui/Button"
import Comments, {
  CommentsSkeleton,
} from "@/components/Comment/Comments/Comments"
import AddComment from "@/components/Comment/AddComent/AddComent"

import type { GetStaticPaths, GetStaticProps } from "next"

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const id = ctx.params?.id
  const post = await ssg.post.getById.fetch(id as string)

  if (!post)
    return {
      notFound: true,
    }

  return {
    props: {
      trpcState: ssg.dehydrate(),
      revalidate: 60 * 5, // 5 minutes
    },
  }
}

export default function PostPage() {
  const { isOpen, open, close } = useCommentStore()

  const router = useRouter()
  const id = router.query.id as string

  const { data: post } = api.post.getById.useQuery(id, {
    refetchOnWindowFocus: false,
  })
  const { data: comments, isLoading: commentsLoading } =
    api.comment.getByPostId.useQuery(id, {
      refetchOnWindowFocus: false,
    })

  const topics = post?.topics?.map((t) => t.name).join(", #")

  return (
    <ForumLayout
      title={`${post?.title ?? ""} - by ${post?.creator.name ?? ""}
       at DevForum.dev`}
      description={`${post?.title ?? ""} - by ${post?.creator.name ?? ""}
       at DevForum.dev - ${topics ? `#${topics}` : ""}`}
    >
      <Head>
        <meta
          property="og:image"
          content={`https://devforum.dev/api/og/post?name=${
            post?.creator.name ?? ""
          }&title=${post?.title ?? ""}`}
        />
      </Head>
      {post && <PostItem post={post} />}
      {isOpen && post && <AddComment postId={id} onClose={() => close()} />}
      {commentsLoading && <CommentsSkeleton />}
      {!commentsLoading && !comments?.length && (
        <div>
          <p className="mb-2 text-center text-xl font-semibold">
            Be the first to comment
          </p>
          <p className="mx-auto max-w-md text-center">
            {`You can make your voice heard. Share your thoughts, ask questions, and get
           involved in the conversation.`}
          </p>
          <Button
            type="button"
            onClick={() => open()}
            className="mx-auto mt-5 block w-fit"
          >
            Leave a comment
          </Button>
        </div>
      )}
      {!!comments?.length && (
        <>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Comments</h2>
              <p className="text-sm text-gray-500">
                {comments.length} comment{comments.length === 1 ? "" : "s"}
              </p>
            </div>
            {!isOpen && <Button onClick={() => open()}>Leave a comment</Button>}
          </div>
          <Comments comments={comments} />
        </>
      )}
    </ForumLayout>
  )
}
