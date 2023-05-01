export default function Categories() {
  return (
    <nav className="flex justify-center">
      <ul className="grid w-full max-w-screen-md grid-cols-2 flex-wrap gap-4 text-center sm:grid-cols-3 lg:grid-cols-4">
        <Category name="Discussions" />
        <Category name="News" />
        <Category name="Help" />
        <Category name="Jobs" />
        <Category name="Showcase" />
        <Category name="Tutorials" />
        <Category name="Resources" />
        <Category name="Others" />
      </ul>
    </nav>
  )
}

function Category({ name }: { name: string }) {
  return (
    <li className="aspect-video rounded-md border bg-white shadow-md">
      <a
        href={`/category/${name.toLowerCase()}`}
        className="block h-full w-full p-2 md:p-4"
      >
        {name}
      </a>
    </li>
  )
}
