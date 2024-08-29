import { StoryObj, StoryFn, Meta } from '@storybook/react';
import { Document } from '@contentful/rich-text-types'

import { RichtextComponent } from './richtextComponent'

// # sample data
import post from '../../../content/contentful/richtext-test.json';

//👇 This default export determines where your story goes in the story list
export default {
    /* 👇 The title prop is optional.
    * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
    * to learn how to generate automatic titles
    */
    title: 'Contentful/RichtextComponent',
    component: RichtextComponent,
    decorators: [
      (RichtextComponent) => (
        <div className="bg-mybg-light dark:bg-mybg-dark text-mytxt dark:text-mytxt-dark">
          <RichtextComponent />
        </div>
      ),
    ],
  } as Meta<typeof RichtextComponent>;
  
  //👇 We create a “template” of how args map to rendering
  const Template: StoryFn<typeof RichtextComponent> = (args) => <RichtextComponent {...args} />;
 
  export const Basic = Template.bind({});
  Basic.args = {
    /*👇 The args you need here will depend on your component */   
    content: post.fields.content as Document
    
  };