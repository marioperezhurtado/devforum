import { useState } from "react"
import { api } from "@/utils/api"
import { generateReactHelpers } from "@uploadthing/react/hooks"

import Avatar from "@/ui/Avatar"
import Image from "next/image"
import LoadSpinner from "@/ui/LoadSpinner"

import type { FileRouter } from "@/server/uploadthing"
import type { RouterOutputs } from "@/utils/api"
type Profile = NonNullable<RouterOutputs["user"]["getByEmail"]>

const { useUploadThing } = generateReactHelpers<FileRouter>()

export default function Banner({
  profile,
  isOwn,
}: {
  profile: Profile
  isOwn: boolean
}) {
  const [isBannerHovered, setIsBannerHovered] = useState(false)
  const [isAvatarHovered, setIsAvatarHovered] = useState(false)

  const utils = api.useContext()

  const { startUpload: uploadBanner, isUploading: isUploadingBanner } =
    useUploadThing({
      endpoint: "banner",
      onClientUploadComplete: () => {
        void utils.user.getByEmail.invalidate(profile.email as string)
      },
    })

  const { startUpload: uploadAvatar, isUploading: isUploadingAvatar } =
    useUploadThing({
      endpoint: "avatar",
      onClientUploadComplete: () => {
        void utils.user.getByEmail.invalidate(profile.email as string)
      },
    })

  return (
    <>
      <div
        onMouseEnter={() => setIsBannerHovered(true)}
        onMouseLeave={() => setIsBannerHovered(false)}
        className={`relative h-28 bg-sky-600 ${
          isUploadingAvatar ? "brightness-50" : ""
        }`}
      >
        {profile.banner && (
          <Image
            src={profile.banner}
            alt={`${profile.name ?? ""}'s profile banner`}
            width={650}
            height={120}
            className="h-28 w-full object-cover"
          />
        )}
        {isUploadingBanner && (
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <LoadSpinner />
          </span>
        )}
        {isOwn && (
          <div
            className={`absolute bottom-2 right-2 flex h-6 w-6 overflow-hidden rounded-md border bg-white opacity-0 shadow-md transition duration-200
        ${isBannerHovered ? "opacity-100" : ""}
        `}
          >
            <input
              className="z-10 opacity-0"
              type="file"
              accept="image/*"
              onChange={(e) => {
                e.target.files && void uploadBanner(Array.from(e.target.files))
              }}
            />
            <Image
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              src="/icons/camera.svg"
              alt="Upload banner image"
              width={18}
              height={18}
            />
          </div>
        )}
      </div>

      <span
        onMouseEnter={() => setIsAvatarHovered(true)}
        onMouseLeave={() => setIsAvatarHovered(false)}
        className="absolute left-3 top-12 z-10 md:left-6"
      >
        <div className="relative">
          <span className={`${isUploadingAvatar ? "brightness-50" : ""}`}>
            <Avatar user={profile} size="xlarge" />
          </span>
          {isUploadingAvatar && (
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <LoadSpinner />
            </span>
          )}
        </div>
        {isOwn && (
          <div
            className={`absolute bottom-0 right-0 flex h-6 w-6 overflow-hidden rounded-md border bg-white opacity-0 shadow-md transition duration-200
        ${isAvatarHovered ? "opacity-100" : ""}
        `}
          >
            <input
              className="z-10 opacity-0"
              type="file"
              accept="image/*"
              onChange={(e) => {
                e.target.files && void uploadAvatar(Array.from(e.target.files))
              }}
            />
            <Image
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              src="/icons/camera.svg"
              alt="Upload banner image"
              width={18}
              height={18}
            />
          </div>
        )}
      </span>
    </>
  )
}
