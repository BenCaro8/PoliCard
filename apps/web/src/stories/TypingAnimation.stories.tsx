import type { Meta, StoryObj } from '@storybook/react';

import TypingAnimation from '../components/TypingAnimation';

const meta = {
  component: TypingAnimation,
} satisfies Meta<typeof TypingAnimation>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    message: {
      id: 'Storybook.testString',
      defaultMessage: 'Test String',
    },
  },
};
