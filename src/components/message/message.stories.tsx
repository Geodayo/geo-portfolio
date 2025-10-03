import type { Meta, StoryObj } from '@storybook/react';
import { Message } from './message.component';

const meta = {
  title: 'Components/Message',
  component: Message,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  }
} satisfies Meta<typeof Message>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextPreview: Story = {
  args: {
    headless: false,
    date: "June 14, 2024",
    type: "text",
    messageText: ["This is the first like of this Message", "This is more Text to follow it"]
  },
};

export const ImagePreview: Story = {
  args: {
    headless: false,
    date: "June 14, 2024",
    type: "image",
    image: "./totoro-profile.jpg"
  },
};
