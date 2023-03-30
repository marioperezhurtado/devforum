import { api } from "@/utils/api"

export default function Topics() {
  const { data: topics, isLoading } = api.topic.getPopular.useQuery()

  if (isLoading) return <TopicsSkeleton />

  return (
    <ul className="scrollbar-hide my-5 flex gap-2 overflow-x-scroll rounded-md bg-zinc-700 p-1.5 md:my-10">
      {topics?.map((t) => (
        <li key={t.name}>
          <Topic name={t.name} />
        </li>
      ))}
    </ul>
  )
}

function Topic({ name }: { name: string }) {
  return (
    <a
      href="#"
      className="z-10 min-w-fit rounded-full bg-sky-600 px-2 py-1 text-sm font-semibold text-sky-50 shadow-md transition hover:bg-sky-500"
    >
      #{name}
    </a>
  )
}

function TopicsSkeleton() {
  return (
    <div className="scrollbar-hide my-5 flex gap-2 overflow-x-scroll rounded-md bg-zinc-700 p-1.5 md:my-10">
      <div className="h-6 w-20 rounded-full bg-sky-600" />
      <div className="h-6 w-20 rounded-full bg-sky-600" />
      <div className="h-6 w-20 rounded-full bg-sky-600" />
      <div className="h-6 w-20 rounded-full bg-sky-600" />
      <div className="h-6 w-20 rounded-full bg-sky-600" />
      <div className="h-6 w-20 rounded-full bg-sky-600" />
      <div className="h-6 w-20 rounded-full bg-sky-600" />
      <div className="h-6 w-20 rounded-full bg-sky-600" />
    </div>
  )
}
