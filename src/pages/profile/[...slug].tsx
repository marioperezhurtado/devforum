import { ssg } from "@/server/api/root"
import { api } from "@/utils/api"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"

import ForumLayout from "@/layout/ForumLayout/ForumLayout"
import ProfileInfo from "@/components/Profile/ProfileInfo/ProfileInfo"
import Filter from "@/components/Post/Filter/Filter"
import PostPreviews, {
  PostPreviewsSkeleton,
} from "@/components/Post/PostPreviews/PostPreviews"
import Link from "next/link"
import Button from "@/ui/Button"

import type { GetStaticPaths, GetStaticProps } from "next"

const filters = ["trending", "latest", "most-upvoted", "controversial"]

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const email = ctx.params?.slug?.[0]
  const filter = ctx.params?.slug?.[1] as string

  if (filter && !filters.includes(filter)) {
    return {
      notFound: true,
    }
  }

  const profile = await ssg.user.getByEmail.fetch(email as string)
  if (!profile)
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

export default function Profile() {
  const router = useRouter()
  const { slug } = router.query
  const email = slug?.[0] as string
  const filter = slug?.[1] ?? "trending"

  const { data: profile } = api.user.getByEmail.useQuery(email, {
    refetchOnWindowFocus: false,
  })

  const {
    followers: followerCount,
    posts: postCount,
    comments: commentCount,
    commentReactions: commentReactionCount,
    postReactions: postReactionCount,
  } = profile?._count ?? {}

  const reactionCount = (commentReactionCount ?? 0) + (postReactionCount ?? 0)

  const { data: trendingPosts, isLoading: trendingLoading } =
    api.post.user.getTrending.useQuery(email, {
      enabled: filter === "trending",
      refetchOnWindowFocus: false,
    })

  const { data: latestPosts, isLoading: latestLoading } =
    api.post.user.getLatest.useQuery(email, {
      enabled: filter === "latest",
      refetchOnWindowFocus: false,
    })

  const { data: mostUpvotedPosts, isLoading: mostUpvotedLoading } =
    api.post.user.getMostUpvoted.useQuery(email, {
      enabled: filter === "most-upvoted",
      refetchOnWindowFocus: false,
    })

  const { data: controversialPosts, isLoading: controversialLoading } =
    api.post.user.getControversial.useQuery(email, {
      enabled: filter === "controversial",
      refetchOnWindowFocus: false,
    })

  const data = {
    trending: { posts: trendingPosts, isLoading: trendingLoading },
    latest: { posts: latestPosts, isLoading: latestLoading },
    "most-upvoted": { posts: mostUpvotedPosts, isLoading: mostUpvotedLoading },
    controversial: {
      posts: controversialPosts,
      isLoading: controversialLoading,
    },
  }

  const { posts, isLoading } = data[filter as keyof typeof data]

  return (
    <ForumLayout
      title={`${profile?.name ?? ""} - DevForum`}
      description={`${profile?.name ?? ""}'s profile on DevForum. Follow ${
        profile?.name ?? ""
      }, or find out about his latest posts and comments.`}
      ogImage={`https://devforum.dev/api/og/profile?name=${
        profile?.name ?? ""
      }&email=${email}&image=${profile?.image ?? ""}
      &followers=${followerCount ?? 0}&posts=${postCount ?? 0}
      &comments=${commentCount ?? 0}&votes=${reactionCount ?? 0}`}
    >
      {profile && <ProfileInfo profile={profile} />}
      <Filter filter={filter} baseLink={`/profile/${email}`} />
      {isLoading && <PostPreviewsSkeleton />}
      {posts && posts.length > 0 && !isLoading && (
        <PostPreviews posts={posts} />
      )}
      {!posts?.length && !isLoading && (
        <NoPostsFound name={profile?.name ?? ""} email={email} />
      )}
    </ForumLayout>
  )
}

function NoPostsFound({ name, email }: { name: string; email: string }) {
  const { data: session, status: sessionStatus } = useSession()
  const isOwnProfile = session?.user?.email === email

  return (
    <>
      {sessionStatus !== "loading" && !isOwnProfile && (
        <div>
          <p className="mb-2 text-center text-xl font-semibold">
            {"This user hasn't posted anything yet."}
          </p>
          <p className="mx-auto max-w-md text-center">
            Follow {name} to stay up to date and get notified when new content
            is published.
          </p>
        </div>
      )}
      {sessionStatus !== "loading" && isOwnProfile && (
        <div>
          <p className="mb-2 text-center text-xl font-semibold">
            {"You haven't posted anything yet."}
          </p>
          <p className="mx-auto max-w-md text-center">
            {
              "Share something or ask a question to get things going, and your posts will appear here. You can also follow other users to see their posts."
            }
          </p>
          <Link href="/create/post">
            <Button className="mx-auto mt-5 block w-fit">Create a post</Button>
          </Link>
        </div>
      )}
    </>
  )
}
