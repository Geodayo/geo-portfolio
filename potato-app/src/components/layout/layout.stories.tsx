import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Layout } from './layout.component';

const meta = {
  title: 'Example/Layout',
  component: Layout,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  }
} satisfies Meta<typeof Layout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LayoutPreview: Story = {
  args: {
    servers: [
      {
        name: "My Language App",
        thumbnail: "https://placekitten.com/200/300",
        serverLink: () => console.log("clicked")
      },
      {
        name: "Design Portfolio",
        thumbnail: "https://placekitten.com/300/300",
        serverLink: () => console.log("clicked")
      },
    ]
  },
};