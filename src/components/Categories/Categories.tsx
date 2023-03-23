export default function Categories() {
  return (
    <nav className="flex justify-center">
      <ul className="grid w-full max-w-screen-md grid-cols-3 flex-wrap gap-4 text-center lg:grid-cols-4">
        <Category name="Discussions" />
        <Category name="News" />
        <Category name="Help needed" />
        <Category name="Jobs" />
        <Category name="Showcase" />
        <Category name="Tutorials" />
        <Category name="Resources" />
        <Category name="Memes" />
      </ul>
    </nav>
  )
}

function Category({ name }: { name: string }) {
  return (
    <li className="aspect-video rounded-md border bg-white shadow-md">
      <a href="#" className="block h-full w-full p-4">
        {name}
      </a>
    </li>
  )
}
