import type { Meta, StoryObj } from "@storybook/react";
import { UsersList } from "./users-list.component";

const meta = {
  title: "Components/Users List",
  component: UsersList,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof UsersList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const UsersListPreview: Story = {
  args: {
    users: [
      {
        thumbnail: "./totoro-profile.jpg",
        name: "Anonymous",
      }
    ],
  },
};
