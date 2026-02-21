import type { Meta, StoryObj } from '@storybook/react';

import AnimatedBackground from '../components/AnimatedBackground';

const meta = {
  component: AnimatedBackground,
} satisfies Meta<typeof AnimatedBackground>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
