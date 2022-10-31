import React from 'react';
import algoliasearch from 'algoliasearch/lite';

const searchClient = algoliasearch(
  '8YAT2UHBPJ',
  '9f21f2b327d6f0e944f5276b1445aa51'
);

const DEFAULT_PROPS = {
  searchClient,
  indexName: 'dev_danzig',
};

export default function Search(props) {
  
  return (
    <div>
      nothing
    </div>
  );
}
