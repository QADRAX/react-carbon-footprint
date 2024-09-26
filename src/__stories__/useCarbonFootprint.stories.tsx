// ExampleApiComponent.stories.tsx
import React from 'react';
import { Meta, Story } from '@storybook/react/types-6-0';
import ExampleComponent from './Example';

export default {
  title: 'Hooks/useCarbonFootprint',
  component: ExampleComponent,
} as Meta;

const Template: Story = () => <ExampleComponent />;

export const Default = Template.bind({});
