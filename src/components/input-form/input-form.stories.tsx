import type { Meta, StoryObj } from '@storybook/react';
import { InputForm } from './input-form.component';

const meta = {
  title: 'Components/Input Form',
  component: InputForm,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  }
} satisfies Meta<typeof InputForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InputFormPreview: Story = {
  args: {
    disableForm: true
  },
};