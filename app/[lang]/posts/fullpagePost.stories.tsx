import { StoryFn, Meta } from '@storybook/react';
import { FullpagePost } from './fullpagePost'
import { IPost } from '../../../lib/contentmodel/wrappertypes';

// # sample data
import hydrated from '../../../content/contentful/richtext-test.json';
const post = {
  ...hydrated,
  contentTypeId: "post",
  toPlainObject(): object {
    return this;
  },
  update(): Promise<IPost> {
    throw new Error("Method not implemented.");
  }
} as unknown as IPost;

//👇 This default export determines where your story goes in the story list
export default {
    /* 👇 The title prop is optional.
    * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
    * to learn how to generate automatic titles
    */
    title: 'Components/FullpagePost',
    component: FullpagePost,
  } as Meta<typeof FullpagePost>;
  
  //👇 We create a "template" of how args map to rendering
  const Template: StoryFn<typeof FullpagePost> = (args) => <FullpagePost {...args} />;
 
  export const Basic = Template.bind({});
  Basic.args = {
    /*👇 The args you need here will depend on your component */   
    content: post 
  };