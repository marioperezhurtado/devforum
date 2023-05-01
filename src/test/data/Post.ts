import type { RouterOutputs } from "@/utils/api"
type PostType = NonNullable<RouterOutputs["post"]["getById"]>

export const Post: PostType = {
  id: "1",
  title: "My Post",
  content: "My Content",
  createdAt: new Date(),
  creatorId: "1",
  communityName: "Test Community",
  _count: {
    comments: 69,
  },
  creator: {
    id: "1",
    name: "John Doe",
    email: "john@test.com",
    image: "https://image.com",
    emailVerified: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  community: {
    name: "Test Community",
    description: "Test Description",
    color: "#000000",
    createdAt: new Date(),
    creatorId: "1",
  },
  topics: [
    { name: "Test Topic", createdAt: new Date() },
    { name: "Test Topic 2", createdAt: new Date() },
  ],
  reactions: [
    {
      id: "1",
      createdAt: new Date(),
      creatorId: "1",
      vote: true,
      postId: "1",
    },
    {
      id: "1",
      createdAt: new Date(),
      creatorId: "1",
      vote: true,
      postId: "1",
    },
  ],
  category: "discussions",
  codeSnippets: [],
  demoUrl: null,
  githubUrl: null,
  discordUrl: null,
  redditUrl: null,
  twitterUrl: null,
  youtubeUrl: null,
}
