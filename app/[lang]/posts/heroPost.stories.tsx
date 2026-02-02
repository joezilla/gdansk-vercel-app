import { IPost } from '../../../lib/contentmodel/wrappertypes';
import { HeroPost } from './heroPost'
import { StoryObj, StoryFn, Meta } from '@storybook/nextjs-vite';

// load sample data
const hydrated = require("../../content/contentful/homepage-post.json");
const post = {
  ...hydrated,
  toPlainObject(): object {
    return this;
  },
  update(): Promise<IPost> {
    throw new Error("Method not implemented.");
  }
}

//👇 This default export determines where your story goes in the story list
export default {
    /* 👇 The title prop is optional.
    * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
    * to learn how to generate automatic titles
    */
    title: 'Components/HeroPost',
    component: HeroPost,
  } as Meta<typeof HeroPost>;
  
  //👇 We create a “template” of how args map to rendering
  const Template: StoryFn<typeof HeroPost> = (args) => <HeroPost {...args} />;
 
  export const Basic = Template.bind({});
  Basic.args = {
    /*👇 The args you need here will depend on your component */   
    content: post
    
  };