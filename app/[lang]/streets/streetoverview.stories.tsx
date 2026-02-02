import { StoryObj, StoryFn, Meta } from '@storybook/nextjs-vite';
import { StreetOverview } from './streetoverview'

// # sample data
import allStreets from '../../../content/contentful/all-streets.json';

//👇 This default export determines where your story goes in the story list
export default {
    /* 👇 The title prop is optional.
    * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
    * to learn how to generate automatic titles
    */
    title: 'Streets/Street Overview',
    component: StreetOverview,
  } as Meta<typeof StreetOverview>;
  
  //👇 We create a StoryFn of how args map to rendering
  const Template: StoryFn<typeof StreetOverview> = (args) => <StreetOverview {...args} />;
  
  export const Basic = Template.bind({});
  Basic.args = {
    /*👇 The args you need here will depend on your component */   
    streets: allStreets
  };
