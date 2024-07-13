import { StoryObj, StoryFn, Meta } from '@storybook/react';
import { Layout } from './layout'

// # sample data
import post from '../../content/contentful/richtext-test.json';

//👇 This default export determines where your story goes in the story list
export default {
    /* 👇 The title prop is optional.
    * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
    * to learn how to generate automatic titles
    */
    title: 'Pages/Main Layout',
    component: Layout,
} as Meta<typeof Layout>;

//👇 We create a “template” of how args map to rendering
const Template: StoryFn<typeof Layout> = (args) => <Layout {...args} />;

export const Basic = Template.bind({});
Basic.args = {
    /*👇 The args you need here will depend on your component */
    children: <p>content goes here</p>,
    preview: false,
    navigationPosts: []
};