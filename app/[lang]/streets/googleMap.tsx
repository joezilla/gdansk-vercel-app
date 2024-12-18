'use client';

import { IStreet } from '../../../lib/contentmodel/wrappertypes';
import { GoogleMap, useJsApiLoader, InfoBox, InfoWindowF, InfoWindow, Marker } from '@react-google-maps/api'
import { log } from 'next-axiom'
import React from 'react';
import ReactDOM from "react-dom";

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

const containerStyle = {
    width: '100%',
    height: '60vh',
}

export function MyGoogleMap(props: GoogleMapProps) {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY ?? "",
    })

    const [map, setMap] = React.useState(null);

    const onLoad = React.useCallback(function callback(map: any) {
        // This is just an example of getting and using the map instance!!! don't just blindly copy!
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);
        setMap(map);
    }, []);

    const onUnmount = React.useCallback(function callback(map: any) {
        setMap(null)
    }, []);

    let center = {
        lat: props.street.fields.location?.lat ?? 54.349802,
        lng: props.street.fields.location?.lon ?? 18.653006
    };


    const infoWindowStyle = {
        background: `white`,
        border: `1px solid ##CCC`,
        padding: 5,
    }

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={16}
            onLoad={onLoad}
            onUnmount={onUnmount}
        >
            {/* Child components, such as markers, info windows, etc. */}
            <>
                <Marker
                    icon={{ path: google.maps.SymbolPath.CIRCLE, scale: 13, fillColor: "red", fillOpacity: 1 }}
                    position={center}
                ></Marker>
                <InfoWindowF position={center} options={{ headerDisabled: true }}>
                    <div style={infoWindowStyle}>
                        <span className='font-bold text-lg text-black'>{props.street.fields.germanName}</span>
                        <br />
                        <span className='text-black'>{props.street.fields.polishNames[0]}</span>
                    </div>
                </InfoWindowF>
            </>
        </GoogleMap>
    ) : (
        <></>
    )

}