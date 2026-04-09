'use client';

import { IStreet } from '../../../lib/contentmodel/wrappertypes';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { log } from 'next-axiom'
import React from 'react';

type GoogleMapProps = {
    street: IStreet;
}

export function GoogleMap(props: GoogleMapProps) {

    const center = {
        lat: props.street.fields.location?.lat ?? 54.349802,
        lng: props.street.fields.location?.lon ?? 18.653006
    };
    const zoom = props.street.fields.location ? 18 : 12;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY ?? "";
    const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAP_ID ?? "";

    if (!apiKey) {
        log.warn("Google maps key not set.");
    }

    if (!mapId) {
        log.warn("Google maps ID not set.");
    }

    return (
        <div style={{ height: '30vh', width: '100%' }}>
            <APIProvider apiKey={apiKey}>
                <Map
                    defaultCenter={center}
                    defaultZoom={zoom}
                    mapId={mapId}
                    style={{ width: '100%', height: '100%' }}
                >
                    {props.street.fields.location && (
                        <AdvancedMarker
                            position={center}
                            title={props.street.fields.germanName}
                        >
                            <svg width="40" height="56" viewBox="0 0 40 56">
                                <path
                                    fill="red"
                                    d="M19.7 0c-10.9 .2-19.7 9.1-19.7 20v.1c0 .1 0 .2 0 .3c.1 7.6 4.5 14.1 10.7 17.4c1.8 .9 3.1 2.4 3.8 4.3l5.5 13.9l5.5-14c.7-1.8 2.1-3.3 3.8-4.2c6.4-3.4 10.7-10.1 10.7-17.8c0-11-9-20-20-20c-0.1 0-0.2 0-0.3 0Z"
                                />
                            </svg>
                        </AdvancedMarker>
                    )}
                </Map>
            </APIProvider>
        </div>
    );
}
