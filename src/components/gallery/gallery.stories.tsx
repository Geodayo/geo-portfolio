import type { Meta, StoryObj } from '@storybook/react';
import { Gallery } from './gallery.component';

const meta = {
  title: 'Components/Gallery',
  component: Gallery,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  }
} satisfies Meta<typeof Gallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ImageGallery: Story = {
  args: {
    images: [
      "./images/AFFOA-06979.jpg",
      "./totoro-profile.jpg",
      "https://placehold.co/600x400",
      "https://placehold.co/650x400",
      "https://placehold.co/700x450",
    ]
  },
};