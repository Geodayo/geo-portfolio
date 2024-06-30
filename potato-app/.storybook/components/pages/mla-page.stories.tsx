import type { Meta, StoryObj } from "@storybook/react";
import { PageLayout } from "../../../src/components/page-layout/page-layout.component";
import React from "react";

const meta = {
  title: "Pages/My Language App",
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
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
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium
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
    users: {},
  },
};
