import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Channel } from './channel.component';

const meta = {
  title: 'Example/Channel',
  component: Channel,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  }
} satisfies Meta<typeof Channel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ChannelPreview: Story = {
  args: {
    text: "general",
    active: true,
    channelLink: "#"
  },
};