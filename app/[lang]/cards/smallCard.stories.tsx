import { StoryFn, Meta } from '@storybook/react';

import { SmallCard } from './smallCard'

// # sample data
// import post from '../../content/contentful/richtext-test.json';

//👇 This default export determines where your story goes in the story list
export default {
    /* 👇 The title prop is optional.
    * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
    * to learn how to generate automatic titles
    */
    title: 'Cards/Small Card',
    component: SmallCard,
} as Meta<typeof SmallCard>;

//👇 We create a “template” of how args map to rendering
const Template: StoryFn<typeof SmallCard> = (args) => <SmallCard {...args} />;

export const Basic = Template.bind({});
Basic.args = {
    /*👇 The args you need here will depend on your component */
    headline: "Headline",
    excerpt: "Excerpt blah blah blah",
    targetLink: "http://www.nytimes.com",
    imageUrl: "https://www.streetsofdanzig.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2F9ieso0n2yz5w%2F5QrqBEolyysoap5zH7bITa%2F85fdbd69d7a97bd496aad073f0473e46%2F10_14_0_5_7337_113_31851933.jpg&w=1080&q=75"
};