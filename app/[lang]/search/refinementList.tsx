'use client';
import React from 'react';

import { connectRefinementList } from 'instantsearch.js/es/connectors';

function RefinementRenderer(renderOptions: { items: Array<{ label: string, value: string, isRefined: boolean }>, refine: (value: string) => void, createURL: (value: string) => string }) {
    const { items, refine } = renderOptions;
    return (
        <>
            {items.map((item) => (
                <div key={item.label} className="flex flex-col space-y-1">
                    <label className="pr-1">
                        <input
                            type="checkbox"
                            value={item.value}
                            checked={item.isRefined}
                            onChange={() => refine(item.value)}
                        />
                        <span className="pl-1">{item.label}</span>
                    </label>
                </div>
            ))}
        </>
    );
}

export default connectRefinementList(RefinementRenderer);
