// 'use client'
import { FancyCard } from './fancycard';
import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer'
import { StreetAPIResponse, StreetSummary } from '@/types/streetApi'

const NUMBER_OF_STREETs_TO_FETCH = 6

type CardGridProps = {
  initialStreets: StreetSummary[]
}

// todo: make these individual card components
export function CardGrid(props: CardGridProps) {
  // let { content, locale } = props;
  const [offset, setOffset] = useState(props.initialStreets.length);
  const [streets, setStreets] = useState<StreetSummary[]>(props.initialStreets);
  const { ref, inView } = useInView()

  const loadMoreStreets = async () => {
    const url = `http://localhost:3000/api/content/cardfeed/${offset}`
    const response = await fetch(url);
    const data = (await response.json()) as StreetAPIResponse;
    console.log(data);
    setStreets([...streets, ...data.streets]);
    setOffset(offset + NUMBER_OF_STREETs_TO_FETCH);
  }

  useEffect(() => {
    if (inView) {
      loadMoreStreets();
    }
  }, [inView])

  //
  return (
    <>
      <section className="dark:bg-mybg-dark dark:text-mytxt-dark">
       <h2 className="text-center text-xl font-bold">Select Streets</h2>
       <div className="grid p-6 justify-center grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {streets.map((street) =>
            <FancyCard key={street.germanName} headline={street.germanName}
              excerpt={`Today known as ${street.polishNames}`} targetLink='#' imageUrl={street.imageUrl}/>
        )}
      </div> 
      <div ref={ref}>&nbsp;</div> 
      
      {/* <button onClick={loadMoreStreets} className="text-center">Load more</button> */}

      </section>
    </>
  );
}