import { StoryFn, Meta } from '@storybook/react';
import Footer  from './footer'


//👇 This default export determines where your story goes in the story list
export default {
    /* 👇 The title prop is optional.
    * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
    * to learn how to generate automatic titles
    */
    title: 'Components/Footer',
    component: Footer,
  } as Meta<typeof Footer>;
  
  //👇 We create a "template" of how args map to rendering
  const Template: StoryFn<typeof Footer> = (args: any) => <Footer {...args} />;
  
  export const Basic = Template.bind({});
  
  Basic.args = {
    /*👇 The args you need here will depend on your component */
    'locale': 'en'
    
  };