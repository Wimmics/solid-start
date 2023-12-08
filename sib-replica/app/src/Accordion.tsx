import { useState } from "react";

export function Accordion(props: {title: string, content: JSX.Element}) {

    const { title, content } = props;

    const [display, setDisplay] = useState<boolean>(false);

    return (
        <div>
            <p 
                style={{ cursor: "pointer" }}
                onClick={() => setDisplay(!display)}
            >
                {title}
            </p>

            {display && content}
        </div>
    )
}