import { StoryFn, Meta } from '@storybook/react';
import { IPost } from '../../../lib/contentmodel/wrappertypes';

import HeaderNavigationModule from './headerNavigation'


// load sample data
import hydrated from '../../../content/contentful/homepage-post.json';
const post = {
  ...hydrated,
  toPlainObject(): object {
    return this;
  },
  update(): Promise<IPost> {
    throw new Error("Method not implemented.");
  }
} as unknown as Partial<IPost>;


//👇 This default export determines where your story goes in the story list
export default {
    /* 👇 The title prop is optional.
    * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
    * to learn how to generate automatic titles
    */
    title: 'Components/HeaderNavigation',
    component: HeaderNavigationModule,
  } as Meta<typeof HeaderNavigationModule>;
  
  //👇 We create a "template" of how args map to rendering
  const Template: StoryFn<typeof HeaderNavigationModule> = (args) => <HeaderNavigationModule {...args} />;
  
  export const Basic = Template.bind({});
  Basic.args = {
    /*👇 The args you need here will depend on your component */   
    navigationPosts: [
    ]
  };

  export const AddtionalItems = Template.bind({});
  AddtionalItems.args = {
    /*👇 The args you need here will depend on your component */   
    navigationPosts: [
        post
    ]
  };