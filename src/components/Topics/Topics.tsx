export default function Topics() {
  return (
    <ul className="scrollbar-hide my-10 flex gap-2 overflow-x-scroll rounded-md bg-zinc-700 p-1.5">
      <Topic name="Frontend" />
      <Topic name="Backend" />
      <Topic name="Fullstack" />
      <Topic name="Mobile" />
      <Topic name="DevOps" />
      <Topic name="Data Science" />
      <Topic name="UI/UX" />
      <Topic name="Game Dev" />
    </ul>
  )
}

function Topic({ name }: { name: string }) {
  return (
    <li className="min-w-fit">
      <a
        href="#"
        className="z-10 rounded-full bg-sky-600 px-2 py-1 text-sm font-semibold text-sky-50 transition hover:bg-sky-500"
      >
        {name}
      </a>
    </li>
  )
}
