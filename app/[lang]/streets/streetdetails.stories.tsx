import { StoryFn, Meta } from '@storybook/react';
import { IStreet } from '../../../lib/contentmodel/wrappertypes';
import { StreetDetail } from './streetdetails'

// # sample data
import hydrated from '../../../content/contentful/Abbegg-Gasse.json';
const aStreet = {
  ...hydrated,
  contentTypeId: "street",
  toPlainObject(): object {
    return this;
  },
  update(): Promise<IStreet> {
    throw new Error("Method not implemented.");
  }
} as unknown as IStreet;

//👇 This default export determines where your story goes in the story list
export default {
    /* 👇 The title prop is optional.
    * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
    * to learn how to generate automatic titles
    */
    title: 'Streets/Street Detail',
    component: StreetDetail,
  } as Meta<typeof StreetDetail>;
  
  //👇 We create a "template" of how args map to rendering
  const Template: StoryFn<typeof StreetDetail> = (args) => <StreetDetail {...args} />;
  
  export const Basic = Template.bind({});
  Basic.args = {
    /*👇 The args you need here will depend on your component */   
    street: aStreet
  };
