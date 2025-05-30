import { StoryFn, Meta } from '@storybook/react';

import { SearchResultCard } from './searchResultCard'

//👇 This default export determines where your story goes in the story list
export default {
    /* 👇 The title prop is optional.
    * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
    * to learn how to generate automatic titles
    */
    title: 'Cards/Search Result Card',
    component: SearchResultCard,
} as Meta<typeof SearchResultCard>;

//👇 We create a “template” of how args map to rendering
const Template: StoryFn<typeof SearchResultCard> = () => <SearchResultCard />;

export const Basic = Template.bind({});
