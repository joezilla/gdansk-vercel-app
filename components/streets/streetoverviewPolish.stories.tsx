import { ComponentStory, ComponentMeta } from '@storybook/react';

import { StreetOverviewPolish } from './streetoverviewPolish'

// # sample data
import allStreets from '../../content/contentful/all-streets.json';

//👇 This default export determines where your story goes in the story list
export default {
    /* 👇 The title prop is optional.
    * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
    * to learn how to generate automatic titles
    */
    title: 'Streets/Street Overview Polish',
    component: StreetOverviewPolish,
  } as ComponentMeta<typeof StreetOverviewPolish>;
  
  //👇 We create a “template” of how args map to rendering
  const Template: ComponentStory<typeof StreetOverviewPolish> = (args) => <StreetOverviewPolish {...args} />;
  
  export const Basic = Template.bind({});
  Basic.args = {
    /*👇 The args you need here will depend on your component */   
    streets: allStreets
  };
