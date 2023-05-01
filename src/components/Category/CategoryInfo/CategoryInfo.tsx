type Props = {
  name: string
  description: string
}

export default function CategoryInfo({ name, description }: Props) {
  return (
    <div className="rounded-md border bg-white px-3 py-2 shadow-md md:px-6 md:py-4">
      <p className="mb-2 text-sm">Category</p>
      <div className="flex flex-wrap items-center gap-6 md:gap-8">
        <h1 className="break-words text-xl font-semibold md:text-2xl">
          {name}
        </h1>
      </div>
      <h2 className="mb-2 mt-3 md:mt-5 md:text-xl">{description}</h2>
    </div>
  )
}
