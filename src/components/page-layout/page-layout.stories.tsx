import type { Meta, StoryObj } from "@storybook/react";
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
    servers: [
      {
        name: "My Language App",
        thumbnail: "https://placekittens.com/200/300",
        serverLink: () => console.log("clicked"),
        channels: [
          {
            text: "general",
            active: true,
            messages: [
              {
                headless: false,
                date: "June 14, 2024",
                messageText: [
                  "This is the first like of this message",
                  "This is more Text to follow it",
                ],
              },
              {
                headless: false,
                date: "June 14, 2024",
                type: "image",
                image: "./totoro-profile.jpg",
              },
              {
                messageText: [
                  "This is the Second of this message",
                  "This is more Text to follow it",
                ],
              },
              {
                type: "image",
                image: "./totoro-profile.jpg",
              },
              {
                headless: false,
                date: "June 14, 2024",
                messageText: [
                  "This is the first like of this message",
                  "This is more Text to follow it",
                  "This is more Text to follow it",
                ],
              },
              {
                headless: false,
                date: "June 14, 2024",
                type: "image",
                image: "./totoro-profile.jpg",
              },
              {
                messageText: [
                  "This is the Second of this message",
                  "This is more Text to follow it",
                ],
              },
              {
                type: "image",
                image: "./totoro-profile.jpg",
              },
              {
                headless: false,
                date: "June 14, 2024",
                messageText: [
                  "This is the first like of this message",
                  "This is more Text to follow it",
                ],
              },
              {
                headless: false,
                date: "June 14, 2024",
                type: "image",
                image: "./totoro-profile.jpg",
              },
              {
                messageText: [
                  "This is the Second of this message",
                  "This is more Text to follow it",
                ],
              },
              {
                type: "image",
                image: "./totoro-profile.jpg",
              },
            ],
          },
          {
            text: "Front End",
            active: false,
          },
          {
            text: "Back End",
            active: false,
          },
        ],
        users: {},
      },
      {
        name: "Design Portfolio",
        thumbnail: "https://placekittens.com/200/300",
        serverLink: () => console.log("clicked"),
        channels: [
          {
            text: "general",
            active: true,
          },
        ],
        users: {},
      },
    ],
  },
};
