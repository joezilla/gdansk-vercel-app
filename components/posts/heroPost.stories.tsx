import { ComponentStory, ComponentMeta } from '@storybook/react';

import { HeroPost } from './heroPost'

// # sample data
import post from '../../content/contentful/homepage-post.json';

//👇 This default export determines where your story goes in the story list
export default {
    /* 👇 The title prop is optional.
    * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
    * to learn how to generate automatic titles
    */
    title: 'Components/HeroPost',
    component: HeroPost,
  } as ComponentMeta<typeof HeroPost>;
  
  //👇 We create a “template” of how args map to rendering
  const Template: ComponentStory<typeof HeroPost> = (args) => <HeroPost {...args} />;
 
  export const Basic = Template.bind({});
  Basic.args = {
    /*👇 The args you need here will depend on your component */   
    content: post
    
  };