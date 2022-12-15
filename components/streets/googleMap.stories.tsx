import { ComponentStory, ComponentMeta } from '@storybook/react';
import { IStreet } from '../../src/@types/contentful';
import { GoogleMap } from './googleMap'

// # sample data
const hydrated = require("../../content/contentful/Abbegg-Gasse.json");
let aStreet = {
  ...hydrated,
  toPlainObject(): object {
    return this;
  },
  update(): Promise<IStreet> {
    throw new Error("Method not implemented.");
  }
}

//👇 This default export determines where your story goes in the story list
export default {
    /* 👇 The title prop is optional.
    * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
    * to learn how to generate automatic titles
    */
    title: 'Streets/Google Map',
    component: GoogleMap,
  } as ComponentMeta<typeof GoogleMap>;
  
  //👇 We create a “template” of how args map to rendering
  const Template: ComponentStory<typeof GoogleMap> = (args) => <GoogleMap {...args} />;
  
  export const Basic = Template.bind({});
  Basic.args = {
    /*👇 The args you need here will depend on your component */   
    street: aStreet
  };
