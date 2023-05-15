import { useState } from "react"
import { api } from "@/utils/api"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateProfileSchema } from "@/utils/zod"
import { toast } from "react-hot-toast"

import Button from "@/ui/Button"
import Modal from "@/ui/Modal"
import FormError from "@/ui/FormError"

import type { z } from "zod"
import type { RouterOutputs } from "@/utils/api"
type Profile = NonNullable<RouterOutputs["user"]["getByEmail"]>

export default function EditProfile({ profile }: { profile: Profile }) {
  const [isEditing, setIsEditing] = useState(false)
  const utils = api.useContext()

  const { mutateAsync } = api.user.update.useMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
  })

  const onSubmit = handleSubmit(async (data) => {
    const { name, bio } = data

    await toast.promise(mutateAsync({ name, bio }), {
      loading: "Updating profile...",
      success: "Profile updated! 🆕",
      error: "Something went wrong",
    })

    await utils.user.getByEmail.invalidate(profile.email as string)
    setIsEditing(false)
  })

  return (
    <>
      <Button onClick={() => setIsEditing(true)} intent="secondary">
        Edit Profile
      </Button>

      {isEditing && (
        <Modal onClose={() => setIsEditing(false)}>
          <form onSubmit={(e) => void onSubmit(e)} className="flex-grow">
            <p className="text-xl font-bold">Edit your profile</p>

            <label htmlFor="name" className="mt-5 block text-sm font-bold">
              Name
            </label>
            <input
              defaultValue={profile.name ?? ""}
              id="name"
              {...register("name")}
              className="mb-2 w-full rounded-md border bg-zinc-50 px-2 py-1 focus:outline-zinc-600"
            />
            {errors.name?.message && (
              <FormError message={errors.name.message} />
            )}

            <label htmlFor="bio" className="mt-4 block text-sm font-bold">
              Bio
            </label>
            <textarea
              defaultValue={profile.bio ?? ""}
              id="bio"
              {...register("bio")}
              className="min-h-[8rem] w-full rounded-md border bg-zinc-50 px-2 py-1 focus:outline-zinc-600"
            />
            {errors.bio?.message && <FormError message={errors.bio.message} />}

            <div className="mt-5 flex justify-end gap-2">
              <Button
                type="button"
                onClick={() => setIsEditing(false)}
                intent="secondary"
              >
                Cancel
              </Button>
              <Button>Save changes</Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}
