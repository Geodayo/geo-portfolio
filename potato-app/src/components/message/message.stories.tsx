import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Message } from './message.component';

const meta = {
  title: 'Example/Message',
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
    children: <span>This is the first like of this message<br /> This is more Text to follow it</span>
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