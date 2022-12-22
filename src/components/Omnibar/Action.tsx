import { ReactNode } from "react"


type Props = {
    hit: {
        label: string
        description?: ReactNode
    }
}
export const Action = ({ hit }: Props) => {
    // Component to display the items
    return (
        <div className="aa-ItemWrapper">
            <div className="aa-ItemContent">
                {/* <div className="aa-ItemIcon"></div> */}
                <div className="aa-ItemContentBody">
                    <div className="aa-ItemContentTitle">
                        <span>{hit.label}</span>
                        {hit.description && <div style={{ fontSize: '0.8rem', paddingRight: '1rem' }}>{hit.description}</div>}

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