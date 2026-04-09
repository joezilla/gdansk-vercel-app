'use client';

import { FancyCard } from '../cards/fancycard';
import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer'
import { StreetAPIResponse, StreetSummary } from '../../../types/streetApi'
import { createStreetURL } from '../../../lib/urlutil';
import { I18N } from "../../../lib/i18n";

const NUMBER_OF_STREETs_TO_FETCH = 6;

type CardGridProps = {
  initialStreets: StreetSummary[],
  locale: string
}

export function CardGrid(props: CardGridProps) {
  const [offset, setOffset] = useState(props.initialStreets.length);
  const [streets, setStreets] = useState<StreetSummary[]>(props.initialStreets);
  const { ref, inView } = useInView();
  const t = new I18N(props.locale).getTranslator();

  const loadMoreStreets = async () => {
    const url = `/api/streetfeed/${offset}`
    const response = await fetch(url);
    const data = (await response.json()) as StreetAPIResponse;
    setStreets([...streets, ...data.streets]);
    setOffset(offset + NUMBER_OF_STREETs_TO_FETCH);
  }

  useEffect(() => {
    if (inView) {
      loadMoreStreets();
    }
  }, [inView])

  return (
    <section className="py-24 px-8 max-w-screen-2xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-4">
        <h2 className="text-4xl font-headline text-primary border-l-4 border-primary pl-6">
          {t("cardGrid.headline")}
        </h2>
      </div>
      <div className="grid justify-center grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {streets.map((street) =>
          <FancyCard
            key={street.germanName}
            headline={street.germanName}
            locale={props.locale}
            excerpt={`Today known as ${street.polishNames}`}
            targetLink={createStreetURL(street.slug, props.locale)}
            imageUrl={street.imageUrl}
          />
        )}
      </div>
      <div ref={ref}>&nbsp;</div>
    </section>
  );
}
