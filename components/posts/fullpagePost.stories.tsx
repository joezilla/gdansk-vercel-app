import { ComponentStory, ComponentMeta } from '@storybook/react';

import { FullpagePost } from './fullpagePost'

// # sample data
import post from '../../content/contentful/richtext-test.json';

//👇 This default export determines where your story goes in the story list
export default {
    /* 👇 The title prop is optional.
    * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
    * to learn how to generate automatic titles
    */
    title: 'Components/FullpagePost',
    component: FullpagePost,
  } as ComponentMeta<typeof FullpagePost>;
  
  //👇 We create a “template” of how args map to rendering
  const Template: ComponentStory<typeof FullpagePost> = (args) => <FullpagePost {...args} />;
 
  export const Basic = Template.bind({});
  Basic.args = {
    /*👇 The args you need here will depend on your component */   
    content: post 
  };