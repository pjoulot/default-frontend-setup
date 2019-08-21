import { withLinks } from '@storybook/addon-links';

import * as myTheme from './theme.js';

import welcome from './welcome.html';

export default {
  title: 'Welcome',
  decorators: [withLinks],
};

export const Welcome = () => welcome;
