'use client';

import { IStreet } from '../../../lib/contentmodel/wrappertypes';
import GoogleMapReact from 'google-map-react';
import { log } from 'next-axiom'
import React from 'react';

function MarkerComponent({ lat, lng }: { lat: number, lng: number }) {
    return (
        <marker>
            <view style={{ width: 40, height: 56 }} className="border-2 text-red-500 bg-red-500">
                <svg width="100%" height="100%" viewBox="0 0 40 56">
                    <path className="text-red-500 bg-red-500"
                        d="M19.7 0c-10.9 .2-19.7 9.1-19.7 20v.1c0 .1 0 .2 0 .3c.1 7.6 4.5 14.1 10.7 17.4c1.8 .9 3.1 2.4 3.8 4.3l5.5 13.9l5.5-14c.7-1.8 2.1-3.3 3.8-4.2c6.4-3.4 10.7-10.1 10.7-17.8c0-11-9-20-20-20c-0.1 0-0.2 0-0.3 0Z" fill="currentColor" />
                </svg>
            </view>
        </marker>
    );
}

type GoogleMapProps = {
    street: IStreet;
}

export function GoogleMap(props: GoogleMapProps) {

    const defaultProps = {
        center: {
            lat: props.street.fields.location?.lat ?? 54.349802,
            lng: props.street.fields.location?.lon ?? 18.653006
        },
        zoom: props.street.fields.location ? 18 : 12,
    };

    const renderMarkers = (map: any, maps: any) => {
        if (!props.street.fields.location) return;

        // Create a new div element for the marker
        const markerElement = document.createElement('div');
        markerElement.className = 'custom-marker';
        markerElement.innerHTML = `
        <svg width="40" height="56" viewBox="0 0 40 56">
            <path fill="red"
                d="M19.7 0c-10.9 .2-19.7 9.1-19.7 20v.1c0 .1 0 .2 0 .3c.1 7.6 4.5 14.1 10.7 17.4c1.8 .9 3.1 2.4 3.8 4.3l5.5 13.9l5.5-14c.7-1.8 2.1-3.3 3.8-4.2c6.4-3.4 10.7-10.1 10.7-17.8c0-11-9-20-20-20c-0.1 0-0.2 0-0.3 0Z" />
        </svg>
    `;

        // Check if AdvancedMarkerElement is available
        if (maps.marker && maps.marker.AdvancedMarkerElement) {
            const marker = new maps.marker.AdvancedMarkerElement({
                map,
                position: { lat: defaultProps.center.lat, lng: defaultProps.center.lng },
                content: markerElement,
                title: props.street.fields.germanName
            });
            return marker;
        } else {
            // Fallback to regular Marker if AdvancedMarkerElement is not available
            const marker = new maps.Marker({
                map,
                position: { lat: defaultProps.center.lat, lng: defaultProps.center.lng },
                title: props.street.fields.germanName
            });
            return marker;
        }
    };

    if (!process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY) {
        log.warn("Google maps key not set.");
    }

    if (!process.env.NEXT_PUBLIC_GOOGLE_MAP_ID) {
        log.warn("Google maps ID not set.");
    }

    return (
        // Important! Always set the container height explicitly
        <div style={{ height: '60vh', width: '100%' }}>
            <GoogleMapReact
                bootstrapURLKeys={{
                    key: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY ?? "",
                    libraries: ['marker'],
                    id: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID ?? ""
                }}
                options={{
                    mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID ?? ""
                }}
                defaultCenter={defaultProps.center}
                defaultZoom={defaultProps.zoom}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({ map, maps }) => {
                    renderMarkers(map, maps);
                }}
            >
            </GoogleMapReact>
        </div>
    );
}