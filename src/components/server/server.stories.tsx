import type { Meta, StoryObj } from '@storybook/react';
import { Server } from './server.component';

const meta = {
  title: 'Components/Server',
  component: Server,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  }
} satisfies Meta<typeof Server>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ServerC: Story = {
  args: {
    name: "My Language App",
    thumbnail: "https://www.placekittens.com/g/200/300",
    serverLink: () => console.log("clicked")
  },
};