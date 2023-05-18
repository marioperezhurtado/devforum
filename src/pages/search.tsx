import { ssg } from "@/server/api/root"
import { api } from "@/utils/api"
import ForumLayout from "@/layout/ForumLayout/ForumLayout"
import PostPreviews from "@/components/Post/PostPreviews/PostPreviews"

import type { GetServerSideProps } from "next"
import type { RouterOutputs } from "@/utils/api"

type Props = {
  results: RouterOutputs["post"]["searchByTitle"]
  search: string
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { search } = ctx.query
  if (!search) {
    return {
      notFound: true,
    }
  }

  await ssg.post.searchByTitle.prefetch(search as string)
  return {
    props: {
      trpcState: ssg.dehydrate(),
      search: search as string,
    },
  }
}

export default function SearchPage({ search }: Props) {
  const { data: results } = api.post.searchByTitle.useQuery(search)

  return (
    <ForumLayout
      title="Search results for: - DevForum"
      description="Search results for: - Browse posts, topics and communities and get involved in the conversation - DevForum"
    >
      <h1 className="mb-8 text-center text-xl font-bold">
        Search results for:{" "}
        <span className="text-gray-500">{`"${search}"`}</span>
      </h1>
      {results && <PostPreviews posts={results} />}
      {!results?.length && (
        <p className="text-center font-bold text-gray-500">
          No results found. Try searching for something else.
        </p>
      )}
    </ForumLayout>
  )
}
