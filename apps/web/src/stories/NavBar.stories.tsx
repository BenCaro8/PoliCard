import type { Meta, StoryObj } from '@storybook/react';
import { navOptions } from '../utils/types';

import NavBar from '../components/NavBar';

const meta = {
  component: NavBar,
} satisfies Meta<typeof NavBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    options: navOptions,
  },
};
