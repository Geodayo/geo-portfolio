import type { Meta, StoryObj } from '@storybook/react';
import { PageFrame } from './page-frame.component';

const meta = {
  title: 'Components/Page Frame',
  component: PageFrame,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  }
} satisfies Meta<typeof PageFrame>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Frame: Story = {
  args: {
    headerTitle: "My Language App",
    children: <div>Hello</div>
  },
};