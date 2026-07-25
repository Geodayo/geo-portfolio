import type { Meta, StoryObj } from "@storybook/react";
import { UserProfile } from "./user-profile.component";

const meta = {
  title: "Components/UserProfile",
  component: UserProfile,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof UserProfile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithBannerImageAndBio: Story = {
  args: {
    avatar: "./totoro-profile.jpg",
    banner: "./totoro-profile.jpg",
    status: "online",
    displayName: "aaryari",
    username: "aaryari",
    badges: ["💜", "🟢", "🏆", "🔷"],
    mutualServers: 1,
    bio: [
      "Digital artist and streamer. I like drawing cute things and playing cozy games.",
      "Say hi if you see me around!",
    ],
    links: [
      "https://www.twitch.tv/aaryari",
      "https://www.youtube.com/@aaryarii",
      "https://discord.gg/S6QgUatmWV",
    ],
    customStatus: { text: "Lil bro", color: "#3ea557" },
  },
};

export const DefaultColorBanner: Story = {
  args: {
    avatar: "./totoro-profile.jpg",
    bannerColor: "#1e1f22",
    status: "dnd",
    displayName: "yuckanthony",
    username: "yuckanthony",
    badges: ["🟢"],
    mutualServers: 1,
    customStatus: { text: "Lil bro", color: "#3ea557" },
  },
};

export const WithLinksNoBio: Story = {
  args: {
    avatar: "./totoro-profile.jpg",
    bannerColor: "#5b2a86",
    status: "dnd",
    displayName: "Ball2r",
    username: "thickpotty",
    badges: ["🍅", "🏁", "🔷"],
    mutualServers: 1,
    bio: ["Minecraft", "Basketball"],
    links: ["https://www.twitch.tv/flatfootnico"],
    customStatus: { text: "Lil bro", color: "#3ea557" },
  },
};

export const MessageDisabled: Story = {
  args: {
    avatar: "./totoro-profile.jpg",
    bannerColor: "#7a5230",
    status: "online",
    displayName: "destroyer",
    username: "destroyergod1",
    mutualServers: 1,
    customStatus: { text: "Lil bro", color: "#3ea557" },
    disableMessage: true,
  },
};

export const LongBioTruncated: Story = {
  args: {
    avatar: "./totoro-profile.jpg",
    bannerColor: "#5865f2",
    status: "online",
    displayName: "Geo",
    username: "geo",
    mutualServers: 3,
    bio: [
      "Freelance developer who builds websites, web apps, and custom tooling for design studios, startups, and agencies.",
      "Working with Cynda Media Lab since 2019 and Fabric Ventures since 2025.",
    ],
    links: ["https://cyndamedialab.com"],
  },
};
