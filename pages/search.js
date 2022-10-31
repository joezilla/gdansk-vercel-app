import React from 'react';
import Head from 'next/head'
import Container from '../components/container'
import Layout from '../components/layout'
import { getNavigationPosts } from '../lib/api'


import algoliasearch from 'algoliasearch/lite';

const searchClient = algoliasearch(
  '8YAT2UHBPJ',
  '9f21f2b327d6f0e944f5276b1445aa51'
);

const DEFAULT_PROPS = {
  searchClient,
  indexName: 'dev_danzig',
};

export default function Search(preview, navigationPosts) {
  
  return (
    <>
    <Layout preview={preview} navigationPosts={navigationPosts}>
      <Head>
        <title>Danzig Street Names</title>
      </Head>
      <Container>
        nix
      </Container>
    </Layout>
  </>
  );
}


export async function getStaticProps({ preview = false }) {
  const navigationPosts = (await getNavigationPosts(preview)) ?? []
  return {
    props: { preview, navigationPosts },
  }
}
