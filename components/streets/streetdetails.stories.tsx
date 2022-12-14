import { ComponentStory, ComponentMeta } from '@storybook/react';

import { StreetDetail } from './streetdetails'

// # sample data
import aStreet from '../../content/contentful/Abbegg-Gasse.json';

//👇 This default export determines where your story goes in the story list
export default {
    /* 👇 The title prop is optional.
    * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
    * to learn how to generate automatic titles
    */
    title: 'Streets/Street Detail',
    component: StreetDetail,
  } as ComponentMeta<typeof StreetDetail>;
  
  //👇 We create a “template” of how args map to rendering
  const Template: ComponentStory<typeof StreetDetail> = (args) => <StreetDetail {...args} />;
  
  export const Basic = Template.bind({});
  Basic.args = {
    /*👇 The args you need here will depend on your component */   
    street: aStreet
  };
