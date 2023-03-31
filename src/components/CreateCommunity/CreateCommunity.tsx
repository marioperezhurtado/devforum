import { api } from "@/utils/api"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { communitySchema } from "@/utils/zod"
import { toast } from "react-hot-toast"

import Link from "next/link"
import Button from "@/ui/Button"
import FormError from "@/ui/FormError"

import type { z } from "zod"

export default function CreateCommunity() {
  const router = useRouter()
  const { data: session } = useSession()

  const { mutateAsync: createPost } = api.community.create.useMutation({
    onSuccess: () => reset(),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof communitySchema>>({
    resolver: zodResolver(communitySchema),
  })

  const onSubmit = handleSubmit(async (data) => {
    if (!session) await router.push("/signIn")

    try {
      const createdCommunity = await toast.promise(
        createPost({
          name: data.name,
          description: data.description,
        }),
        {
          loading: "Creating community...",
          success: "Community created! 🚀",
          error: "Failed to create community",
        }
      )

      await router.push(`/community/${createdCommunity.name}`)
    } catch (e) {}
  })

  return (
    <form
      onSubmit={(e) => void onSubmit(e)}
      name="createCommunity"
      className="rounded-md border bg-white px-2 py-3 shadow-md md:px-6 md:py-4"
    >
      <div className="mb-2">
        <label htmlFor="name" className="sr-only">
          Name
        </label>
        <input
          {...register("name")}
          placeholder="Community Name"
          className="mb-2 w-full rounded-md border bg-zinc-50 px-2 py-1 focus:outline-sky-600 md:py-2 md:px-4"
        />
        {errors.name?.message && <FormError message={errors.name.message} />}
      </div>
      <div className="mb-2">
        <label htmlFor="description" className="sr-only">
          Description
        </label>
        <textarea
          {...register("description")}
          placeholder="What is your community about?"
          className="h-20 w-full rounded-md border bg-zinc-50 px-2 py-1  focus:outline-sky-600 md:py-2 md:px-4"
        />
        {errors.description?.message && (
          <FormError message={errors.description.message} />
        )}
      </div>
      <div className="flex items-center justify-end gap-1.5 md:mt-2 md:gap-4">
        <Button onClick={() => void reset()} type="button" intent="secondary">
          Reset
        </Button>
        {session && <Button type="submit">Create Community</Button>}
        {!session && (
          <Link href="/signIn">
            <Button type="button">Create Community</Button>
          </Link>
        )}
      </div>
    </form>
  )
}
