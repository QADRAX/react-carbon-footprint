// ExampleApiComponent.stories.tsx
import React from 'react';
import { Meta, Story } from '@storybook/react/types-6-0';
import ExampleApiComponent from './Example';

export default {
  title: 'Hooks/useCo2Footprint',
  component: ExampleApiComponent,
} as Meta;

const Template: Story = () => <ExampleApiComponent />;

export const Default = Template.bind({});
