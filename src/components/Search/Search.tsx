import { useState } from "react"
import useDebounce from "@/hooks/useDebounce"
import { api } from "@/utils/api"
import { useRouter } from "next/router"

import Image from "next/image"
import LoadSpinner from "@/ui/LoadSpinner"

export default function Search() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 500)

  const {
    data: results,
    isFetching,
    isLoading,
  } = api.post.searchByTitlePreview.useQuery(debouncedSearch, {
    refetchOnWindowFocus: false,
    enabled: search.length > 3,
  })

  const goToResult = (id: string) => {
    setSearch("")
    setIsOpen(false)
    void router.push(`/post/${id}`)
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSearch("")
    setIsOpen(false)
    void router.push(`/search?search=${search}`)
  }

  return (
    <form
      onSubmit={handleSearch}
      name="searchForm"
      role="searchbox"
      className="relative mx-auto hidden sm:block sm:w-80 lg:w-96"
    >
      <label htmlFor="search" className="sr-only">
        Search topics, posts, users and more
      </label>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        name="search"
        id="search"
        type="text"
        placeholder="Start exploring..."
        aria-label="search"
        role="searchbox"
        className="w-full rounded-full border bg-zinc-50 px-3 py-1 focus:outline-sky-600"
      />
      <button
        aria-label="search"
        className="absolute right-0 top-1/2 h-full -translate-y-1/2 rounded-r-full !bg-sky-600 pl-2 pr-2.5 transition hover:!bg-sky-500"
      >
        <Image src="/icons/search.svg" alt="Search" width={18} height={18} />
      </button>
      {search.length > 3 && isOpen && !isLoading && (
        <div className="absolute top-11 z-20 w-full max-w-md rounded-md border bg-white p-4 pb-2 text-sm shadow-md">
          {!!results?.length && (
            <ul className="mb-2 flex flex-col gap-2 font-bold">
              {results?.map((result) => (
                <li key={result.id}>
                  <button
                    type="button"
                    onClick={() => void goToResult(result.id)}
                    className="w-full text-left"
                  >
                    {result.title}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {results?.length === 0 && (
            <p className="mb-2 font-bold text-gray-500">No results found.</p>
          )}
          {!!results?.length && results.length >= 5 && (
            <button
              type="submit"
              className="ml-auto block font-bold text-sky-600 underline"
            >
              See all results
            </button>
          )}
        </div>
      )}
      {isFetching && (
        <span className="absolute right-12 top-1/2 -translate-y-1/2">
          <LoadSpinner />
        </span>
      )}
    </form>
  )
}
