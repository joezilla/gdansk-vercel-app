
import React from 'react';

import { connectRefinementList } from "react-instantsearch-dom";


function RefinementRenderer(renderOptions: any) {
    const { items, refine, createURL } = renderOptions;
    return (
        <>
            {items.map((item: any) => (
                <div key={item.label} className="flex flex-col space-y-1">
                    <label className="pr-1">
                        <input
                            type="checkbox"
                            value={item.value}
                            checked={item.isRefined}
                            onChange={(event) => refine(item.value)}
                        />
                        <span className="pl-1">{item.label}</span>
                    </label>
                </div>
            ))}
        </>
    );
}

export default connectRefinementList(RefinementRenderer);
