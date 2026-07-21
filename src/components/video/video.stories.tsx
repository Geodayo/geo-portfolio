import type { Meta, StoryObj } from '@storybook/react';
import { Video } from './video.component';

const meta = {
  title: 'Components/Video',
  component: Video,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'padded',
  }
} satisfies Meta<typeof Video>;

export default meta;
type Story = StoryObj<typeof meta>;

export const YouTubeVideo: Story = {
  args: {
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
};

export const YouTubeShortUrl: Story = {
  args: {
    url: 'https://youtu.be/dQw4w9WgXcQ',
  },
};

export const VimeoVideo: Story = {
  args: {
    url: 'https://player.vimeo.com/video/501330026',
  },
};