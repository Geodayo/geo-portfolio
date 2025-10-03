import type { Meta, StoryObj } from "@storybook/react";
import { ChannelList } from "./channels-list.component";

const meta = {
  title: "Components/Channel List",
  component: ChannelList,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof ChannelList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ChannelListPreview: Story = {
  args: {
    channels: [
      {
        text: "general",
        active: true,
        channelLink: () => console.log("clicked"),
      },
      {
        text: "Front End",
        active: false,
        channelLink: () => console.log("clicked"),
      },
      {
        text: "Back End",
        active: false,
        channelLink: () => console.log("clicked"),
      },
    ],
  },
};
