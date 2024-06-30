import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { PageLayout } from "./page-layout.component";

const meta = {
  title: "Components/Page Layout",
  component: PageLayout,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof PageLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PageLayoutPreview: Story = {
  args: {
    serverName: "My Language App",
    servers: [
      {
        name: "My Language App",
        thumbnail: "https://placekitten.com/200/300",
        serverLink: () => console.log("clicked"),
      },
      {
        name: "Design Portfolio",
        thumbnail: "https://placekitten.com/200/300",
        serverLink: () => console.log("clicked"),
      },
    ],
    messages: [
      {
        headless: false,
        date: "June 14, 2024",
        children: (
          <span>
            This is the first like of this message
            <br /> This is more Text to follow it
          </span>
        ),
      },
      {
        headless: false,
        date: "June 14, 2024",
        type: "image",
        image: "./totoro-profile.jpg",
      },
      {
        children: (
          <span>
            This is the Second of this message
            <br /> This is more Text to follow it
          </span>
        ),
      },
      {
        type: "image",
        image: "./totoro-profile.jpg",
      },
      {
        headless: false,
        date: "June 14, 2024",
        children: (
          <span>
            This is the first like of this message
            <br /> This is more Text to follow it
          </span>
        ),
      },
      {
        headless: false,
        date: "June 14, 2024",
        type: "image",
        image: "./totoro-profile.jpg",
      },
      {
        children: (
          <span>
            This is the Second of this message
            <br /> This is more Text to follow it
          </span>
        ),
      },
      {
        type: "image",
        image: "./totoro-profile.jpg",
      },
      {
        headless: false,
        date: "June 14, 2024",
        children: (
          <span>
            This is the first like of this message
            <br /> This is more Text to follow it
          </span>
        ),
      },
      {
        headless: false,
        date: "June 14, 2024",
        type: "image",
        image: "./totoro-profile.jpg",
      },
      {
        children: (
          <span>
            This is the Second of this message
            <br /> This is more Text to follow it
          </span>
        ),
      },
      {
        type: "image",
        image: "./totoro-profile.jpg",
      },
    ],
    channels: {
      channels: [
        {
          text: "general",
          active: true,
          channelLink: "#",
        },
        {
          text: "Front End",
          active: false,
          channelLink: "#",
        },
        {
          text: "Back End",
          active: false,
          channelLink: "#",
        },
      ],
    },
    users: {}
  },
};
