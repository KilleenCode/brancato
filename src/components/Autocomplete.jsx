import { autocomplete } from '@algolia/autocomplete-js';
import React, { createElement, Fragment, useEffect, useRef } from 'react';
import { render } from 'react-dom';
import "@algolia/autocomplete-theme-classic";

export const Action = ({ hit }) => {
    // Component to display the items
    return (
      <div className="aa-ItemWrapper">
        <div className="aa-ItemContent">
          {/* <div className="aa-ItemIcon"></div> */}
          <div className="aa-ItemContentBody">
            <div className="aa-ItemContentTitle">
              <span>{hit.label}</span>
              {/* {hit.enabled && (
                <code className="aa-ItemContentTitleNote">Enabled</code>
              )} */}
            </div>
          </div>
        </div>
        <div className="aa-ItemActions">
          <button
            className="aa-ItemActionButton aa-DesktopOnly aa-ActiveOnly"
            type="button"
            title="Select"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M18.984 6.984h2.016v6h-15.188l3.609 3.609-1.406 1.406-6-6 6-6 1.406 1.406-3.609 3.609h13.172v-4.031z" />
            </svg>
          </button>
        </div>
      </div>
    );
  }
export function Autocomplete(props) {
   
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const search = autocomplete({
      detachedMediaQuery: 'none',
      container: containerRef.current,
      renderer: { createElement, Fragment },
      render({ children }, root) {
        render(children, root);
      },
      ...props,
    });

    return () => {
      search.destroy();
    };
  }, [props, containerRef]);

  return <div ref={containerRef} />;
}
