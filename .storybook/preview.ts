import type { Preview } from "@storybook/react";


const preview: Preview = {
  parameters: {
    backgrounds: {
      options: {
        dark: { name: "Dark", value: "#313338" },
        light: { name: "Light", value: "#FFFFFF" },
      },
    },
  },
  initialGlobals: {
    backgrounds: { value: "dark" },
  },
};

export default preview;
