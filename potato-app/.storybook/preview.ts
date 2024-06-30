import type { Preview } from "@storybook/react";

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'Dark',
      values: [
        {
          name: 'Dark',
          value: '#313338',
        },
        {
          name: 'Light',
          value: '#FFFFFF',
        },
      ],
    },
  },
};

export default preview;
