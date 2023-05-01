export default function Info({ children }: { children: React.ReactNode }) {
  return (
    <div className="group relative w-fit rounded-full border bg-white">
      <svg
        width="20px"
        height="20px"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <g id="SVGRepo_iconCarrier">
          <path
            d="M12 17V16.9929M12 14.8571C12 11.6429 15 12.3571 15 9.85714C15 8.27919 13.6568 7 12 7C10.6567 7 9.51961 7.84083 9.13733 9"
            stroke="#000000"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
      <span className="absolute bottom-7 left-0 hidden w-60 rounded-md border bg-white px-3 py-2 text-sm group-hover:block xs:w-96">
        {children}
      </span>
    </div>
  )
}
